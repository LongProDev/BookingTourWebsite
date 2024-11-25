import api from './api';

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
      // Send all data in a single request
      const response = await api.post('/bookings', {
        ...bookingData,
        seatsToUpdate: bookingData.numberOfAdults + bookingData.numberOfChildren
      });
      return response.data;
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
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
};

export default bookingService; 