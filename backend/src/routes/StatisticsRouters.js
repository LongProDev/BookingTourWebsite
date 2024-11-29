import express from 'express';
import StatisticsController from '../controllers/StatisticsController.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/all', adminMiddleware, StatisticsController.getAllStats);

export default router; 