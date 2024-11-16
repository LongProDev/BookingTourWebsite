const Booking = require("../models/Booking");

const bookingController = {
  // Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find().populate("customerId", "-password");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      const booking = new Booking({
        ...req.body,
        bookingDate: new Date()
      });
      
      const newBooking = await booking.save();
      const populatedBooking = await Booking.findById(newBooking._id)
        .populate("customerId", "-password");
      
      res.status(201).json(populatedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
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

module.exports = bookingController;
