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

      if (schedule.availableSeats < seatsToUpdate) {
        return res.status(400).json({
          success: false,
          message: "Not enough seats available"
        });
      }

      // Update seats
      schedule.availableSeats -= seatsToUpdate;
      await tour.save();

      // Create booking
      const booking = new Booking({
        ...bookingData,
        bookingDate: new Date(),
        tourStatus: 'Paid'
      });
      
      const newBooking = await booking.save();
      const populatedBooking = await Booking.findById(newBooking._id)
        .populate("customerId", "-password");
      
      res.status(201).json({
        success: true,
        data: populatedBooking
      });
    } catch (error) {
      console.error('Booking creation error:', error);
      res.status(500).json({
        success: false,
        message: error.message
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
  }
};

export default bookingController;
