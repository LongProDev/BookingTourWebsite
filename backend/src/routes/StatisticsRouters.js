import express from 'express';
import { StatisticsController } from '../controllers/StatisticsController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/dashboard', verifyAdmin, StatisticsController.getDashboardStats);
router.get('/revenue', verifyAdmin, StatisticsController.getRevenueStats);

export default router; 