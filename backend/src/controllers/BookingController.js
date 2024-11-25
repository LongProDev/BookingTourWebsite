import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

const bookingController = {
  // Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find().populate("customerId", "-password");
      res.status(200).json({
        success: true,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  // Get booking by ID
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("customerId", "-password");
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get bookings by customer ID
  getBookingsByCustomer: async (req, res) => {
    try {
      const bookings = await Booking.find({ customerId: req.params.customerId })
        .populate("customerId", "-password");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new booking
  createBooking: async (req, res) => {
    try {
      const { seatsToUpdate, ...bookingData } = req.body;
      
      // Find tour and validate seats
      const tour = await Tour.findById(bookingData.tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found"
        });
      }

      const schedule = tour.schedules.id(bookingData.scheduleId);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found"
        });
      }

      const totalSeats = seatsToUpdate || 
        (bookingData.numberOfAdults + bookingData.numberOfChildren);

      if (schedule.availableSeats < totalSeats) {
        return res.status(400).json({
          success: false,
          message: "Not enough seats available"
        });
      }

      // Create booking with validated status values
      const booking = new Booking({
        ...bookingData,
        bookingDate: new Date(),
        tourStatus: 'Pending',
        paymentStatus: 'Pending'
      });
      
      const newBooking = await booking.save();

      // Update seats after successful booking creation
      schedule.availableSeats -= totalSeats;
      await tour.save();
      
      res.status(201).json({
        success: true,
        data: newBooking
      });
    } catch (error) {
      console.error('Booking creation error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create booking'
      });
    }
  },

  // Update booking
  updateBooking: async (req, res) => {
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate("customerId", "-password");
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete booking
  deleteBooking: async (req, res) => {
    try {
      const booking = await Booking.findByIdAndDelete(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cancel booking
  cancelBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }

      // Update booking status
      booking.tourStatus = 'Canceled';
      booking.paymentStatus = 'Canceled';
      await booking.save();

      // Return seats to schedule
      const tour = await Tour.findById(booking.tourId);
      const schedule = tour.schedules.id(booking.scheduleId);
      schedule.availableSeats += (booking.numberOfAdults + booking.numberOfChildren);
      await tour.save();

      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Check payment status
  checkPaymentStatus: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }

      res.status(200).json({
        success: true,
        paymentStatus: booking.paymentStatus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update payment status
  updateBookingPayment: async (req, res) => {
    try {
      const { paymentStatus } = req.body;
      const bookingId = req.params.id;

      if (!['Pending', 'Processing', 'Completed', 'Failed'].includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status"
        });
      }

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { paymentStatus },
        { new: true }
      );
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error('Payment update error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update payment status'
      });
    }
  }
};

export default bookingController;
