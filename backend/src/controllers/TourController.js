import Tour from "../models/Tour.js";

const TourController = {
  // Get all tours
  getAllTours: async (req, res) => {
    try {
      const tours = await Tour.find();
      res.status(200).json({
        success: true,
        data: tours
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
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
      res.status(201).json({
        success: true,
        data: newTour
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
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
  },

  // Get featured tours
  getFeaturedTours: async (req, res) => {
    try {
      const featuredTours = await Tour.find({ featured: true });
      res.status(200).json({
        success: true,
        message: "Successfully fetched featured tours",
        data: featuredTours
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get tour by search
  getTourBySearch: async (req, res) => {
    const { location, startLocation, price } = req.query;
    
    try {
      const query = {};
      
      if (location) query.location = { $regex: location, $options: 'i' };
      if (startLocation) query.startLocation = { $regex: startLocation, $options: 'i' };
      if (price) query.price = { $lte: parseInt(price) };

      const tours = await Tour.find(query);
      
      res.status(200).json({
        success: true,
        message: "Successfully found tours",
        data: tours
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Not found"
      });
    }
  },

  getAdminTours: async (req, res) => {
    try {
      const tours = await Tour.find();
      res.status(200).json({
        success: true,
        message: "Successfully fetched all tours",
        data: tours
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default TourController;
