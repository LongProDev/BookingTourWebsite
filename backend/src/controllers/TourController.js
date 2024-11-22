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
        return res.status(404).json({
          success: false,
          message: "Tour not found"
        });
      }
      res.status(200).json(tour);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create new tour
  createTour: async (req, res) => {
    try {
      const tourData = req.body;
      
      // Handle image files
      if (req.files) {
        const imageUrls = req.files.map(file => file.filename);
        tourData.image = imageUrls;
      }

      const newTour = new Tour(tourData);
      await newTour.save();

      res.status(201).json({
        success: true,
        message: 'Tour created successfully',
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
      const { id } = req.params;
      const updateData = req.body;

      // Ensure schedules is always an array
      if (updateData.schedules && !Array.isArray(updateData.schedules)) {
        updateData.schedules = [];
      }

      if (req.files && req.files.length > 0) {
        const imageUrls = req.files.map(file => file.filename);
        updateData.image = imageUrls;
      }

      const tour = await Tour.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Successfully updated tour",
        data: tour
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
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
  },

  updateScheduleSeats: async (req, res) => {
    try {
      const { tourId, scheduleId } = req.params;
      const { bookedSeats } = req.body;

      const tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({ success: false, message: 'Tour not found' });
      }

      const schedule = tour.schedules.id(scheduleId);
      if (!schedule) {
        return res.status(404).json({ success: false, message: 'Schedule not found' });
      }

      schedule.availableSeats -= bookedSeats;
      
      if (schedule.availableSeats < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Not enough available seats' 
        });
      }

      await tour.save();
      
      res.status(200).json({
        success: true,
        data: schedule
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
