const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Student = require('../models/Student');
const LedgerTransaction = require('../models/LedgerTransaction');

const router = express.Router();

router.use(authenticate);

// Daily collection report
router.get('/collection/daily', authorize('director', 'principal', 'accountant'), async (req, res, next) => {
  try {
    const { date } = req.query;
    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const payments = await Payment.aggregate([
      {
        $match: {
          schoolId: req.user.schoolId,
          paymentDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$paymentMode',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalCollection = payments.reduce((sum, p) => sum + p.totalAmount, 0);

    res.json({
      success: true,
      data: {
        date: startDate.toISOString().split('T')[0],
        breakdown: payments,
        totalCollection,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Monthly collection report
router.get('/collection/monthly', authorize('director', 'principal', 'accountant'), async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const payments = await Payment.aggregate([
      {
        $match: {
          schoolId: req.user.schoolId,
          paymentDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' },
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalCollection = payments.reduce((sum, p) => sum + p.totalAmount, 0);

    res.json({
      success: true,
      data: {
        month: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
        dailyBreakdown: payments,
        totalCollection,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Outstanding fees report
router.get('/outstanding', authorize('director', 'principal', 'accountant'), async (req, res, next) => {
  try {
    const { classFilter, section } = req.query;

    const studentFilter = { schoolId: req.user.schoolId };
    if (classFilter) studentFilter.class = classFilter;
    if (section) studentFilter.section = section;

    const students = await Student.find(studentFilter);
    const studentIds = students.map((s) => s._id);

    const lastTransactions = await LedgerTransaction.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$studentId',
          balance: { $first: '$balance' },
        },
      },
    ]);

    const outstanding = lastTransactions
      .filter((t) => t.balance > 0)
      .sort((a, b) => b.balance - a.balance);

    const totalOutstanding = outstanding.reduce((sum, t) => sum + t.balance, 0);

    res.json({
      success: true,
      data: {
        studentCount: students.length,
        outstandingCount: outstanding.length,
        outstanding: outstanding.slice(0, 50), // Top 50
        totalOutstanding,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Expense report
router.get('/expenses', authorize('director', 'principal', 'accountant'), async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { schoolId: req.user.schoolId };
    if (startDate || endDate) {
      filter.expenseDate = {};
      if (startDate) filter.expenseDate.$gte = new Date(startDate);
      if (endDate) filter.expenseDate.$lte = new Date(endDate);
    }

    const expenses = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.totalAmount, 0);

    res.json({
      success: true,
      data: {
        categoryBreakdown: expenses,
        totalExpenses,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
