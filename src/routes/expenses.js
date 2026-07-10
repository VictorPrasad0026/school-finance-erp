const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');
const Expense = require('../models/Expense');
const LedgerTransaction = require('../models/LedgerTransaction');
const { ValidationError } = require('../utils/errors');
const { TRANSACTION_TYPES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

// Create expense
router.post('/', authorize('accountant', 'admin'), async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.expenseCreate);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const expense = new Expense({
      ...value,
      schoolId: req.user.schoolId,
      createdBy: req.user._id,
    });
    await expense.save();

    // Create ledger transaction for school expenses
    const transaction = new LedgerTransaction({
      transactionType: TRANSACTION_TYPES.EXPENSE,
      debit: value.amount,
      description: `Expense: ${value.category}`,
      referenceId: expense._id,
      referenceModel: 'Expense',
      createdBy: req.user._id,
      schoolId: req.user.schoolId,
    });
    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Expense recorded',
      data: expense,
    });
  } catch (err) {
    next(err);
  }
});

// Get all expenses
router.get('/', async (req, res, next) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { schoolId: req.user.schoolId };
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.expenseDate = {};
      if (startDate) filter.expenseDate.$gte = new Date(startDate);
      if (endDate) filter.expenseDate.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ expenseDate: -1 })
      .populate('createdBy', 'firstName lastName');

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      data: {
        expenses,
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
