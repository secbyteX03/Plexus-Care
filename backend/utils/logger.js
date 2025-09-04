const winston = require('winston');
const path = require('path');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, json } = format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  }`;
});

// Create logs directory if it doesn't exist
const logDir = 'logs';
const fs = require('fs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json(),
    format.errors({ stack: true })
  ),
  defaultMeta: { service: 'plexus-care-backend' },
  transports: [
    // Write all logs with level 'error' and below to 'error.log'
    new transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with level 'info' and below to 'combined.log'
    new transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    handleExceptions: true,
    handleRejections: true,
  }));
}

// Create a stream for morgan to use
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
