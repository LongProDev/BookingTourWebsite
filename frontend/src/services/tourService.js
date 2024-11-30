import api from './api';
import axios from 'axios';

const tourService = {
  getAllTours: async (page = 0, limit = 8) => {
    const response = await api.get(`/tours?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAdminTours: async () => {
    const response = await api.get('/tours/admin');
    return response.data;
  },

  getTourById: async (id) => {
    try {
      const response = await api.get(`/tours/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tour:', error);
      throw error;
    }
  },

  getReviews: async (tourId) => {
    try {
      console.log("Calling getReviews for tourId:", tourId);
      const response = await api.get(`/reviews/tour/${tourId}`);
      console.log("API response for reviews:", response);
      return response.data;
    } catch (error) {
      console.error("Error in getReviews:", error);
      throw error;
    }
  },

  createTour: async (tourData) => {
    try {
      const response = await api.post('/tours', tourData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTour: async (id, tourData) => {
    try {
      const response = await api.put(`/tours/${id}`, tourData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
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
  },

  createReview: async (reviewData) => {
    try {
      const response = await api.post(`/reviews`, reviewData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSchedule: async (tourId, scheduleId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tours/${tourId}/schedules/${scheduleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default tourService; 