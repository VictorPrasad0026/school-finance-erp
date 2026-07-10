const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Receipt = require('../models/Receipt');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { NotFoundError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

const router = express.Router();

router.use(authenticate);

// Generate receipt
router.post('/', authorize('accountant', 'admin'), async (req, res, next) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      throw new ValidationError('Payment ID is required');
    }

    const payment = await Payment.findById(paymentId).populate('studentId');
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Generate receipt number
    const settings = await require('../models/Settings').findOne({ schoolId: req.user.schoolId });
    const receiptNumber = `${settings?.receiptPrefix || 'RCP'}-${settings?.receiptNumber || 1000}`;

    const receipt = new Receipt({
      schoolId: req.user.schoolId,
      receiptNumber,
      studentId: payment.studentId._id,
      paymentId,
      amount: payment.amount,
      discount: payment.discount,
      netAmount: payment.amount - (payment.discount || 0),
      paymentMode: payment.paymentMode,
      monthsPaid: payment.monthsPaid,
      collectorId: req.user._id,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RCP-${payment._id}`,
    });

    await receipt.save();

    // Update receipt number in settings
    if (settings) {
      settings.receiptNumber = (settings.receiptNumber || 1000) + 1;
      await settings.save();
    }

    res.status(201).json({
      success: true,
      message: 'Receipt generated',
      data: receipt,
    });
  } catch (err) {
    next(err);
  }
});

// Get receipt by ID
router.get('/:id', async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('studentId')
      .populate('collectorId', 'firstName lastName');

    if (!receipt) {
      throw new NotFoundError('Receipt not found');
    }

    res.json({
      success: true,
      data: receipt,
    });
  } catch (err) {
    next(err);
  }
});

// Get all receipts
router.get('/', async (req, res, next) => {
  try {
    const { studentId, startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { schoolId: req.user.schoolId };
    if (studentId) filter.studentId = studentId;
    if (startDate || endDate) {
      filter.receiptDate = {};
      if (startDate) filter.receiptDate.$gte = new Date(startDate);
      if (endDate) filter.receiptDate.$lte = new Date(endDate);
    }

    const receipts = await Receipt.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ receiptDate: -1 })
      .populate('studentId', 'firstName lastName admissionNumber');

    const total = await Receipt.countDocuments(filter);

    res.json({
      success: true,
      data: {
        receipts,
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
