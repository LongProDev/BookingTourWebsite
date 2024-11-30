import express from 'express';
import reviewController from '../controllers/ReviewController.js';
import { authenticateToken } from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', reviewController.getAllReviews);
router.get('/tour/:tourId', reviewController.getReviewsByTourId);

// Protected routes
router.use(authenticateToken);
router.post('/', reviewController.createReview);

// Admin routes
router.delete('/:id', adminMiddleware, reviewController.deleteReview);

export default router; 