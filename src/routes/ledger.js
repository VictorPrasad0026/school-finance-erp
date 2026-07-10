const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const LedgerTransaction = require('../models/LedgerTransaction');
const { ValidationError, NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get student ledger
router.get('/student/:studentId', async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const transactions = await LedgerTransaction.find({ studentId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName');

    const total = await LedgerTransaction.countDocuments({ studentId });

    // Get current balance (latest balance)
    const lastTransaction = await LedgerTransaction.findOne({ studentId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: {
        transactions,
        currentBalance: lastTransaction?.balance || 0,
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

// Get summary report
router.get('/summary/:schoolId', authorize('director', 'principal', 'accountant'), async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const { startDate, endDate } = req.query;

    const filter = { schoolId };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const transactions = await LedgerTransaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$transactionType',
          totalDebit: { $sum: '$debit' },
          totalCredit: { $sum: '$credit' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
