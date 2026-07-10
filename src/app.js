const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const securityMiddleware = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiter');
errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(...securityMiddleware);
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/ledger', require('./routes/ledger'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/expenses', require('./routes/expenses'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
