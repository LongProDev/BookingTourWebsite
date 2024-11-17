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
    const response = await api.get(`/tours/${id}`);
    return response.data;
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
};

export default tourService; 