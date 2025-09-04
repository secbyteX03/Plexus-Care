require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { StatusCodes } = require('http-status-codes');
const logger = require('./utils/logger');

// Import routes
const paymentRoutes = require('./routes/paymentRoutes');
const trialRoutes = require('./routes/trialRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/trials', trialRoutes);

// 404 handler
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`[${new Date().toISOString()}] ${err.stack}`);
  
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong on our end' 
    : err.message;

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.stack}`);
  server.close(() => process.exit(1));
});

module.exports = server;
