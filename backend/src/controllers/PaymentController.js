import crypto from "crypto";
import axios from "axios";
import Booking from "../models/Booking.js";
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QPPXIADo7PcXLdxAJP2FpNCzNXQQdYVfHXEcPvED0y4vqo2A3MikcBa31WUpqvMZQBwElD2GsTOIyplhOFbVprX00LGJEZ3jv');

const PaymentController = {
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
