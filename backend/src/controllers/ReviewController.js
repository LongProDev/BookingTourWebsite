import Review from "../models/Review.js";
import Tour from "../models/Tour.js";

const reviewController = {
  getAllReviews: async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate('userId', 'username')
        .populate('tourId', 'name');
      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createReview: async (req, res) => {
    try {
      const review = new Review({
        ...req.body,
        userId: req.user.id
      });
      await review.save();

      // Update tour rating statistics
      await Tour.updateRatingStats(review.tourId);

      res.status(201).json({
        success: true,
        data: review
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found"
        });
      }

      await review.deleteOne();
      
      // Update tour rating statistics after deletion
      await Tour.updateRatingStats(review.tourId);

      res.status(200).json({
        success: true,
        message: "Review deleted successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getReviewsByTourId: async (req, res) => {
    try {
      const { tourId } = req.params;
      const reviews = await Review.find({ tourId })
        .populate('userId', 'username')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default reviewController; 