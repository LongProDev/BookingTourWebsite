import express from 'express';
import PaymentController from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/create-stripe-session', PaymentController.createStripePayment);
router.post('/stripe-webhook', express.raw({type: 'application/json'}), PaymentController.handleStripeWebhook);

export default router; 