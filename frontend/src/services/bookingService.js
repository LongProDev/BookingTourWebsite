import api from './api';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const bookingService = {
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  getBookingsByCustomer: async (customerId) => {
    const response = await api.get(`/bookings/customer/${customerId}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  updateBookingPayment: async (bookingId, paymentStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/bookings/${bookingId}/payment`,
        { paymentStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      console.error('Payment update error:', error);
      throw error.response?.data || error;
    }
  },

  getBookingsByEmail: async (email) => {
    try {
      const response = await api.get(`/bookings/user/email/${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default bookingService; 