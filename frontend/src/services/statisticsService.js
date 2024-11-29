import api from './api';

const statisticsService = {
  getAllStats: async () => {
    try {
      const response = await api.get('/statistics/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
};

export default statisticsService; 