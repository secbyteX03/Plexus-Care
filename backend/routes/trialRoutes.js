const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const trialController = require('../controllers/trialController');
const { validateRequest } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// Start a free trial
router.post(
  '/start',
  authenticate,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('planId').optional().isString().withMessage('Valid plan ID is required'),
    body('trialPeriodDays').optional().isInt({ min: 1, max: 30 }).withMessage('Trial period must be between 1-30 days')
  ],
  validateRequest,
  trialController.startTrial
);

// Get trial status
router.get(
  '/status',
  authenticate,
  trialController.getTrialStatus
);

// Cancel trial
router.post(
  '/cancel',
  authenticate,
  trialController.cancelTrial
);

// Convert trial to paid subscription
router.post(
  '/convert-to-paid',
  authenticate,
  [
    body('paymentMethodId').notEmpty().withMessage('Payment method ID is required'),
    body('planId').notEmpty().withMessage('Plan ID is required')
  ],
  validateRequest,
  trialController.convertToPaid
);

module.exports = router;
