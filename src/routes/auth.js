const express = require('express');
const { validate, schemas } = require('../utils/validators');
const authService = require('../services/authService');
const { generateTokens, verifyRefreshToken } = require('../services/tokenService');
const { authLimiter } = require('../middleware/rateLimiter');
const { ValidationError, AppError } = require('../utils/errors');

const router = express.Router();

// Register
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.userRegistration);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const result = await authService.register(value);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.userLogin);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const result = await authService.login(value.email, value.password);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// Refresh Token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ValidationError('Refresh token required');
    }

    const result = await authService.refreshAccessToken(refreshToken);
    res.json({
      success: true,
      message: 'Token refreshed',
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;
