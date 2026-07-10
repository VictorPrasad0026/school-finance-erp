const mongoose = require('mongoose');
const { PAYMENT_MODES } = require('../utils/constants');

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    receiptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Receipt',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      enum: Object.values(PAYMENT_MODES),
      required: true,
    },
    referenceNumber: String,
    chequeNumber: String,
    bankName: String,
    upiId: String,
    transactionId: String,
    monthsPaid: [String], // e.g., ["2024-01", "2024-02"]
    discount: {
      type: Number,
      default: 0,
    },
    remarks: String,
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ studentId: 1, paymentDate: -1 });
paymentSchema.index({ schoolId: 1, paymentDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
