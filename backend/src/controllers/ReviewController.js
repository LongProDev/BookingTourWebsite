import Review from "../models/Review.js";

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
      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Review deleted successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default reviewController; 