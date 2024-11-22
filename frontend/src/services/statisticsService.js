import api from './api';

const statisticsService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/statistics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }
};

export default statisticsService; 