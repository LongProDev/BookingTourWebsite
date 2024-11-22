import express from 'express';
import discountController from '../controllers/DiscountController.js';

const router = express.Router();

router.post('/validate', discountController.validateCode);

export default router; 