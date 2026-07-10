const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const LedgerTransaction = require('../models/LedgerTransaction');

const router = express.Router();

router.use(authenticate);

// Dashboard summary
router.get('/dashboard', authorize('director', 'principal', 'accountant'), async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    // Today's collection
    const todayCollection = await Payment.aggregate([
      {
        $match: {
          schoolId: req.user.schoolId,
          paymentDate: { $gte: today },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // This month's collection
    const monthCollection = await Payment.aggregate([
      {
        $match: {
          schoolId: req.user.schoolId,
          paymentDate: { $gte: thisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // This year's collection
    const yearCollection = await Payment.aggregate([
      {
        $match: {
          schoolId: req.user.schoolId,
          paymentDate: { $gte: thisYear },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: { schoolId: req.user.schoolId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Payment mode breakdown
    const paymentModes = await Payment.aggregate([
      { $match: { schoolId: req.user.schoolId, paymentDate: { $gte: thisMonth } } },
      { $group: { _id: '$paymentMode', total: { $sum: '$amount' } } },
    ]);

    res.json({
      success: true,
      data: {
        today: todayCollection[0]?.total || 0,
        month: monthCollection[0]?.total || 0,
        year: yearCollection[0]?.total || 0,
        expenses: totalExpenses[0]?.total || 0,
        paymentModes,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Revenue vs Expenses
router.get('/cash-flow', authorize('director', 'principal'), async (req, res, next) => {
  try {
    const { months = 12 } = req.query;
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

      const revenue = await Payment.aggregate([
        {
          $match: {
            schoolId: req.user.schoolId,
            paymentDate: { $gte: monthStart, $lte: monthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const expenses = await Expense.aggregate([
        {
          $match: {
            schoolId: req.user.schoolId,
            expenseDate: { $gte: monthStart, $lte: monthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      data.push({
        month: date.toISOString().substring(0, 7),
        revenue: revenue[0]?.total || 0,
        expenses: expenses[0]?.total || 0,
        profit: (revenue[0]?.total || 0) - (expenses[0]?.total || 0),
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
