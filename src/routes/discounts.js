const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');
const Discount = require('../models/Discount');
const LedgerTransaction = require('../models/LedgerTransaction');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { TRANSACTION_TYPES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

// Create discount
router.post('/', authorize('principal', 'admin'), async (req, res, next) => {
  try {
    const { studentId, discountType, discountValue, month, reason } = req.body;

    if (!studentId || !discountType || !discountValue || !month) {
      throw new ValidationError('Missing required fields');
    }

    const discount = new Discount({
      schoolId: req.user.schoolId,
      studentId,
      discountType,
      discountValue,
      month,
      reason,
      createdBy: req.user._id,
    });

    await discount.save();

    // Create ledger transaction
    const lastTransaction = await LedgerTransaction.findOne({ studentId }).sort({
      createdAt: -1,
    });
    const currentBalance = lastTransaction?.balance || 0;
    const newBalance = currentBalance - discountValue;

    const transaction = new LedgerTransaction({
      studentId,
      transactionType: TRANSACTION_TYPES.DISCOUNT,
      credit: discountValue,
      balance: newBalance,
      description: `Discount: ${discountType}`,
      referenceId: discount._id,
      referenceModel: 'Discount',
      createdBy: req.user._id,
      schoolId: req.user.schoolId,
      remarks: reason,
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Discount created',
      data: discount,
    });
  } catch (err) {
    next(err);
  }
});

// Get all discounts
router.get('/', async (req, res, next) => {
  try {
    const { month, studentId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { schoolId: req.user.schoolId };
    if (month) filter.month = month;
    if (studentId) filter.studentId = studentId;

    const discounts = await Discount.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('studentId', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');

    const total = await Discount.countDocuments(filter);

    res.json({
      success: true,
      data: {
        discounts,
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

// Approve discount
router.patch('/:id/approve', authorize('principal', 'admin'), async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, approvedBy: req.user._id },
      { new: true }
    );

    if (!discount) {
      throw new NotFoundError('Discount not found');
    }

    res.json({
      success: true,
      message: 'Discount approved',
      data: discount,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
