import api from './api';

const tourService = {
  getAllTours: async () => {
    const response = await api.get('/tours');
    return response.data;
  },

  getAdminTours: async () => {
    const response = await api.get('/tours/admin');
    return response.data;
  },

  getTourById: async (id) => {
    try {
      const response = await api.get(`/tours/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching tour:', error);
      throw error;
    }
  },

  createTour: async (tourData) => {
    const response = await api.post('/tours', tourData);
    return response.data;
  },

  updateTour: async (id, tourData) => {
    const response = await api.put(`/tours/${id}`, tourData);
    return response.data;
  },

  deleteTour: async (id) => {
    const response = await api.delete(`/tours/${id}`);
    return response.data;
  },

  updateScheduleSeats: async (tourId, scheduleId, totalBookedSeats) => {
    try {
      const response = await api.patch(`/tours/${tourId}/schedules/${scheduleId}/seats`, {
        bookedSeats: totalBookedSeats
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default tourService; 