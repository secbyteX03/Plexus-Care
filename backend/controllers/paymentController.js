const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');
const IntaSend = require('intasend-node');
const { v4: uuidv4 } = require('uuid');

// Initialize IntaPay client
const intaPay = new IntaSend({
  publicKey: process.env.INTA_PAY_PUBLIC_KEY,
  secretKey: process.env.INTA_PAY_SECRET_KEY,
  test: process.env.INTA_PAY_LIVE !== 'true'
});

/**
 * Create a payment intent
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { planId, planName, amount, period, currency, userId, userEmail } = req.body;
    
    // Generate a unique reference for this payment
    const reference = `PLEXUS-${Date.now()}-${uuidv4().substring(0, 8)}`;
    
    // Create payment intent
    const paymentIntent = await intaPay.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      payment_method_types: ['m-pesa', 'card', 'bank'],
      metadata: {
        planId,
        planName,
        period,
        userId,
        reference
      },
      customer: {
        email: userEmail,
        name: req.user?.name || 'Plexus Care User',
        phone: req.user?.phone || ''
      },
      description: `Plexus Care ${planName} (${period}) subscription`,
      statement_descriptor: `PLEXUS*${planName.substring(0, 15)}`,
      receipt_email: userEmail,
      confirm: false
    });

    logger.info(`Created payment intent ${paymentIntent.id} for user ${userId}`);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        reference,
        amount,
        currency
      }
    });
  } catch (error) {
    logger.error(`Error creating payment intent: ${error.message}`, { error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to create payment intent',
      code: 'PAYMENT_INTENT_CREATION_FAILED'
    });
  }
};

/**
 * Verify a payment
 */
const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId, payload } = req.body;
    const userId = req.user.id;

    // Verify the payment with IntaPay
    const paymentIntent = await intaPay.paymentIntents.retrieve(paymentIntentId);
    
    if (!paymentIntent) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'Payment intent not found',
        code: 'PAYMENT_INTENT_NOT_FOUND'
      });
    }

    // Check if payment was successful
    if (paymentIntent.status !== 'succeeded') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Payment not completed',
        code: 'PAYMENT_NOT_COMPLETED',
        paymentStatus: paymentIntent.status
      });
    }

    // Verify the payment amount matches what was expected
    const expectedAmount = payload.amount * 100; // Convert to cents
    if (paymentIntent.amount !== expectedAmount) {
      logger.warn(`Payment amount mismatch for intent ${paymentIntentId}. Expected ${expectedAmount}, got ${paymentIntent.amount}`);
      // In a real app, you might want to handle this case differently
    }

    // Process the successful payment
    // In a real app, you would update your database here
    const paymentRecord = {
      id: paymentIntent.id,
      userId,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      planId: paymentIntent.metadata.planId,
      planName: paymentIntent.metadata.planName,
      period: paymentIntent.metadata.period,
      reference: paymentIntent.metadata.reference,
      paymentMethod: paymentIntent.payment_method_types[0],
      createdAt: new Date(paymentIntent.created * 1000), // Convert to milliseconds
      updatedAt: new Date()
    };

    logger.info(`Payment verified: ${paymentIntent.id} for user ${userId}`);

    // In a real app, you would save this to your database
    // await savePaymentRecord(paymentRecord);
    // await updateUserSubscription(userId, paymentRecord);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        payment: paymentRecord,
        message: 'Payment verified successfully'
      }
    });
  } catch (error) {
    logger.error(`Error verifying payment: ${error.message}`, { error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to verify payment',
      code: 'PAYMENT_VERIFICATION_FAILED'
    });
  }
};

/**
 * Handle webhook events from IntaPay
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['intapay-signature'];
  let event;

  try {
    // Verify the webhook signature
    event = intaPay.webhooks.constructEvent(
      req.body,
      sig,
      process.env.INTA_PAY_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(StatusCodes.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  const paymentIntent = event.data.object;
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(paymentIntent);
      break;
    // Add more event types as needed
    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(StatusCodes.OK).json({ received: true });
};

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent) {
  try {
    const { id, amount, currency, metadata, status } = paymentIntent;
    const { userId, planId, planName, period, reference } = metadata;

    // In a real app, you would update your database here
    const paymentRecord = {
      id,
      userId,
      amount: amount / 100, // Convert back to dollars
      currency,
      status,
      planId,
      planName,
      period,
      reference,
      paymentMethod: paymentIntent.payment_method_types?.[0] || 'unknown',
      paidAt: new Date()
    };

    logger.info(`Payment succeeded: ${id} for user ${userId}`);
    
    // In a real app, you would save this to your database
    // await savePaymentRecord(paymentRecord);
    // await updateUserSubscription(userId, paymentRecord);
    
    // You might also want to send a confirmation email
    // await sendPaymentConfirmationEmail(userId, paymentRecord);
  } catch (error) {
    logger.error(`Error handling successful payment: ${error.message}`, { error });
    // In a real app, you might want to retry or notify an admin
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
  try {
    const { id, last_payment_error, metadata } = paymentIntent;
    const { userId } = metadata;

    logger.warn(`Payment failed: ${id} for user ${userId}`, {
      error: last_payment_error
    });

    // In a real app, you might want to notify the user or an admin
    // await sendPaymentFailedEmail(userId, paymentIntent);
  } catch (error) {
    logger.error(`Error handling failed payment: ${error.message}`, { error });
  }
}

/**
 * Get payment history for a user
 */
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    // In a real app, you would fetch this from your database
    // const payments = await Payment.find({ userId })
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(parseInt(limit));
    // const total = await Payment.countDocuments({ userId });
    
    // Mock response for now
    const payments = [];
    const total = 0;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        payments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    logger.error(`Error fetching payment history: ${error.message}`, { error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to fetch payment history',
      code: 'PAYMENT_HISTORY_FETCH_FAILED'
    });
  }
};

module.exports = {
  createPaymentIntent,
  verifyPayment,
  handleWebhook,
  getPaymentHistory
};
