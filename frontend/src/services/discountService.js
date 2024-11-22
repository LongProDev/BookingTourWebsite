import api from './api';

const discountService = {
  validateCode: async (code) => {
    try {
      const response = await api.post('/discounts/validate', { code });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error validating discount code:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid discount code'
      };
    }
  }
};

export default discountService; 