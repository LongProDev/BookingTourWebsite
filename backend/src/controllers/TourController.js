const Tour = require("../models/Tour");

const tourController = {
  // Get all tours
  getAllTours: async (req, res) => {
    try {
      const tours = await Tour.find();
      res.status(200).json(tours);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get tour by ID
  getTourById: async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.status(200).json(tour);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new tour
  createTour: async (req, res) => {
    try {
      const tour = new Tour(req.body);
      const newTour = await tour.save();
      res.status(201).json(newTour);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update tour
  updateTour: async (req, res) => {
    try {
      const tour = await Tour.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      res.status(200).json(tour);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete tour
  deleteTour: async (req, res) => {
    try {
      const tour = await Tour.findByIdAndDelete(req.params.id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.status(200).json({ message: "Tour deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = tourController;
