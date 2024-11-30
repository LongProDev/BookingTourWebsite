import Tour from "../models/Tour.js";
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

const TourController = {
  getAllTours: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 8;
      const skip = page * limit;

      const tours = await Tour.find()
        .skip(skip)
        .limit(limit);

      const total = await Tour.countDocuments();

      const toursWithFormattedImages = tours.map(tour => ({
        ...tour._doc,
        image: tour.image.map(img => 
          img.startsWith('http') ? img : img.replace(/^\/images\//, '')
        )
      }));
      
      res.status(200).json({
        success: true,
        data: toursWithFormattedImages,
        totalTours: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getTourById: async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.id);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found"
        });
      }

      res.status(200).json({
        success: true,
        data: tour
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createTour: async (req, res) => {
    try {
      console.log('Received tour data:', req.body);
      console.log('Received files:', req.files);

      // Validate required fields
      const requiredFields = [
        'name', 'description', 'price', 'time', 
        'location', 'startLocation'
      ];
      
      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Validate images
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one image is required"
        });
      }

      // Prepare tour data with proper type conversion
      const tourData = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price) || 0,
        time: req.body.time,
        location: req.body.location,
        startLocation: req.body.startLocation,
        featured: req.body.featured === 'true',
        image: req.files.map(file => file.originalname),
        schedules: []
      };

      // Parse schedules if provided
      if (req.body.schedules) {
        try {
          const schedulesData = JSON.parse(req.body.schedules);
          tourData.schedules = schedulesData.map(schedule => ({
            departureDate: new Date(schedule.departureDate),
            departureTime: schedule.departureTime,
            returnDate: new Date(schedule.returnDate),
            returnTime: schedule.returnTime,
            transportation: schedule.transportation,
            availableSeats: parseInt(schedule.availableSeats),
            price: parseFloat(schedule.price)
          }));
        } catch (e) {
          console.error('Error parsing schedules:', e);
          tourData.schedules = [];
        }
      }

      console.log('Processed tour data:', tourData);

      const newTour = new Tour(tourData);
      const savedTour = await newTour.save();

      res.status(201).json({
        success: true,
        message: "Tour created successfully",
        data: savedTour
      });
    } catch (error) {
      console.error('Tour creation error:', error);
      // Clean up uploaded files on error
      if (req.files) {
        req.files.forEach(file => {
          const filePath = path.join(process.cwd(), 'public', 'images', file.filename);
          fs.unlink(filePath, err => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating tour'
      });
    }
  },

  updateTour: async (req, res) => {
    try {
      const updateData = { ...req.body };
      
      // Handle numeric fields
      if (updateData.price) updateData.price = parseFloat(updateData.price);
      if (updateData.featured) updateData.featured = updateData.featured === 'true';

      // Handle schedules
      if (updateData.schedules) {
        try {
          const schedulesData = JSON.parse(updateData.schedules);
          updateData.schedules = schedulesData.map(schedule => ({
            departureDate: new Date(schedule.departureDate),
            departureTime: schedule.departureTime,
            returnDate: new Date(schedule.returnDate),
            returnTime: schedule.returnTime,
            transportation: schedule.transportation,
            availableSeats: parseInt(schedule.availableSeats),
            price: parseFloat(schedule.price)
          }));
        } catch (e) {
          console.error('Error parsing schedules:', e);
          updateData.schedules = [];
        }
      }

      // Handle new images if uploaded
      if (req.files && req.files.length > 0) {
        // Get the existing tour to handle image cleanup
        const existingTour = await Tour.findById(req.params.id);
        if (existingTour && existingTour.image) {
          // Delete old images
          existingTour.image.forEach(filename => {
            if (!filename.startsWith('http')) {
              const filePath = path.join(process.cwd(), 'public', 'images', filename);
              fs.unlink(filePath, err => {
                if (err) console.error('Error deleting old file:', err);
              });
            }
          });
        }
        // Update with new images
        updateData.image = req.files.map(file => file.filename);
      }

      const tour = await Tour.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { 
          new: true,
          runValidators: true
        }
      );

      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Tour updated successfully",
        data: tour
      });
    } catch (error) {
      console.error('Tour update error details:', {
        name: error.name,
        message: error.message,
        errors: error.errors
      });
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteTour: async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.id);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found"
        });
      }

      // Delete associated images
      if (tour.image && tour.image.length > 0) {
        tour.image.forEach(filename => {
          const filePath = path.join(process.cwd(), 'public', 'images', filename);
          fs.unlink(filePath, err => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }

      await Tour.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Tour deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getFeaturedTours: async (req, res) => {
    try {
      const featuredTours = await Tour.find({ featured: true });
      res.status(200).json({
        success: true,
        data: featuredTours
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getTourBySearch: async (req, res) => {
    try {
      const { location, startLocation, price } = req.query;
      const query = {};

      if (location) query.location = { $regex: location, $options: 'i' };
      if (startLocation) query.startLocation = { $regex: startLocation, $options: 'i' };
      if (price) query.price = { $lte: parseFloat(price) };

      const tours = await Tour.find(query);
      res.status(200).json({
        success: true,
        data: tours
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAdminTours: async (req, res) => {
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

  updateScheduleSeats: async (req, res) => {
    try {
      const { tourId, scheduleId } = req.params;
      const { seatsToBook } = req.body;

      const tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found"
        });
      }

      const schedule = tour.schedules.id(scheduleId);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found"
        });
      }

      if (schedule.availableSeats < seatsToBook) {
        return res.status(400).json({
          success: false,
          message: "Not enough seats available"
        });
      }

      schedule.availableSeats -= seatsToBook;
      await tour.save();

      res.status(200).json({
        success: true,
        message: "Seats updated successfully",
        availableSeats: schedule.availableSeats
      });
    } catch (error) {
      console.error('Seat update error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default TourController;
