import api from './api';

const paymentService = {
  createStripeCheckout: async (orderData) => {
    try {
      if (!process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
        throw new Error('Payment system is not properly configured');
      }

      const response = await api.post('/payments/create-stripe-session', {
        amount: orderData.totalPrice,
        bookingId: orderData._id,
        currency: 'usd'
      });

      if (!response.data?.url) {
        throw new Error('Invalid payment response');
      }

      return response.data;
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  }
};

export default paymentService;
