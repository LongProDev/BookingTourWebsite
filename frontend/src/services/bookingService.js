import api from './api';
import tourService from './tourService';

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
      if (response.data.success) {
        // Update available seats after successful booking
        await tourService.updateScheduleSeats(
          bookingData.tourId,
          bookingData.scheduleId,
          bookingData.numberOfAdults + bookingData.numberOfChildren
        );
      }
      return response.data;
    } catch (error) {
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