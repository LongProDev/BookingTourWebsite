import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import { sendBookingConfirmationEmail } from '../services/emailService.js';

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
      const { seatsToUpdate, isGuestBooking, guestInfo, ...bookingData } = req.body;
      
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

      // Create booking with guest or user information
      const booking = new Booking({
        ...bookingData,
        bookingDate: new Date(),
        tourStatus: 'Pending',
        paymentStatus: 'Pending',
        isGuestBooking: true,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        customerId: req.user?._id || null
      });
      
      const newBooking = await booking.save();

      // Update seats
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

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { 
          paymentStatus,
          tourStatus: paymentStatus === 'Completed' ? 'Paid' : 'Pending'
        },
        { new: true }
      ).populate('tourId');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }

      // Send confirmation email only if payment is completed
      if (paymentStatus === 'Completed') {
        try {
          await sendBookingConfirmationEmail(booking);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Continue with the response even if email fails
        }
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
  },

  // Get booking payment status
  getBookingPaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      return res.json({
        success: true,
        paymentStatus: booking.paymentStatus
      });
    } catch (error) {
      console.error('Error getting booking payment status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get booking payment status'
      });
    }
  }
};

export default bookingController;
