const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { validateRequest } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// Create payment intent
router.post(
  '/create-intent',
  authenticate,
  [
    body('planId').notEmpty().withMessage('Plan ID is required'),
    body('planName').notEmpty().withMessage('Plan name is required'),
    body('amount').isNumeric().withMessage('Valid amount is required'),
    body('period').isIn(['monthly', 'yearly']).withMessage('Valid period is required'),
    body('currency').isLength({ min: 3, max: 3 }).withMessage('Valid currency code is required'),
    body('userId').notEmpty().withMessage('User ID is required'),
    body('userEmail').isEmail().withMessage('Valid email is required')
  ],
  validateRequest,
  paymentController.createPaymentIntent
);

// Verify payment
router.post(
  '/verify',
  authenticate,
  [
    body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
    body('payload').isObject().withMessage('Valid payload is required')
  ],
  validateRequest,
  paymentController.verifyPayment
);

// Webhook handler for payment events
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// Get payment history for a user
router.get(
  '/history',
  authenticate,
  paymentController.getPaymentHistory
);

module.exports = router;
