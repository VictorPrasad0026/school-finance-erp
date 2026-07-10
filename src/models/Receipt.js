const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    netAmount: Number,
    paymentMode: String,
    monthsPaid: [String],
    outstanding: Number,
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    collectorSignature: String,
    pdfUrl: String,
    qrCode: String,
    receiptDate: {
      type: Date,
      default: Date.now,
    },
    isPrinted: {
      type: Boolean,
      default: false,
    },
    printCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

receiptSchema.index({ schoolId: 1, receiptNumber: 1 });
receiptSchema.index({ studentId: 1, receiptDate: -1 });

module.exports = mongoose.model('Receipt', receiptSchema);
