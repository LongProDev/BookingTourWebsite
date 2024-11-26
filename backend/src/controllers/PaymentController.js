import crypto from "crypto";
import axios from "axios";
import Booking from "../models/Booking.js";
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QPPXIADo7PcXLdxAJP2FpNCzNXQQdYVfHXEcPvED0y4vqo2A3MikcBa31WUpqvMZQBwElD2GsTOIyplhOFbVprX00LGJEZ3jv');

const PaymentController = {
  
  createMoMoPayment: async (req, res) => {
    try {
      const { amount, bookingId, orderInfo, returnUrl } = req.body;

      // MoMo configuration
      const partnerCode = process.env.MOMO_PARTNER_CODE;
      const accessKey = process.env.MOMO_ACCESS_KEY;
      const secretKey = process.env.MOMO_SECRET_KEY;
      const requestId = `${bookingId}_${Date.now()}`;
      const orderId = requestId;
      const requestType = "captureWallet";
      const extraData = "";
      const ipnUrl = process.env.MOMO_IPN_URL;

      // Create signature
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      // Create request body
      const requestBody = {
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: returnUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "en",
      };

      // Send request to MoMo
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error("MoMo payment error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  handleMoMoCallback: async (req, res) => {
    try {
      const { orderId, resultCode, amount, orderInfo } = req.body;
      const bookingId = orderId.split("_")[0];

      if (resultCode === 0) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          booking.paymentStatus = "Completed";
          await booking.save();
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("MoMo callback error:", error);
      res.status(500).json({ success: false });
    }
  },

  createStripePayment: async (req, res) => {
    try {
      const { amount, bookingId, currency = 'usd' } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Tour Booking',
                description: `Booking ID: ${bookingId}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
        metadata: {
          bookingId,
        },
      });

      res.json({ 
        success: true, 
        sessionId: session.id,
        url: session.url 
      });
    } catch (error) {
      console.error('Stripe session creation error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  handleStripeWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;

      try {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'Completed'
        });
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    }

    res.json({ received: true });
  },
};

export default PaymentController;
