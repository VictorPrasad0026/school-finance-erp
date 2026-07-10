const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const LedgerTransaction = require('../models/LedgerTransaction');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { TRANSACTION_TYPES } = require('../utils/constants');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Create payment
router.post('/', authorize('accountant', 'admin'), async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.paymentCreate);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Create payment
    const payment = new Payment({
      ...value,
      collectorId: req.user._id,
      schoolId: req.user.schoolId,
    });
    await payment.save();

    // Create ledger transaction
    const lastTransaction = await LedgerTransaction.findOne({
      studentId: value.studentId,
    }).sort({ createdAt: -1 });

    const currentBalance = lastTransaction?.balance || 0;
    const newBalance = currentBalance - value.amount + (value.discount || 0);

    const transaction = new LedgerTransaction({
      studentId: value.studentId,
      transactionType: TRANSACTION_TYPES.PAYMENT,
      credit: value.amount,
      balance: newBalance,
      description: `Payment received - ${value.paymentMode}`,
      referenceId: payment._id,
      referenceModel: 'Payment',
      createdBy: req.user._id,
      schoolId: req.user.schoolId,
      remarks: value.remarks,
    });
    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { payment, transaction },
    });
  } catch (err) {
    next(err);
  }
});

// Get payment by ID
router.get('/:id', async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('studentId')
      .populate('collectorId', 'firstName lastName');

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
});

// Get all payments
router.get('/', async (req, res, next) => {
  try {
    const { studentId, startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { schoolId: req.user.schoolId };
    if (studentId) filter.studentId = studentId;
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ paymentDate: -1 })
      .populate('studentId', 'firstName lastName admissionNumber');

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
