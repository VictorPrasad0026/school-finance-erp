const mongoose = require('mongoose');
const { TRANSACTION_TYPES } = require('../utils/constants');

const ledgerTransactionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
    },
    description: String,
    referenceId: mongoose.Schema.Types.ObjectId,
    referenceModel: {
      type: String,
      enum: ['Payment', 'Discount', 'Expense', 'Refund'],
    },
    month: String, // e.g., "2024-01"
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: String,
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
  },
  { timestamps: true }
);

// Immutable - prevent updates after creation
ledgerTransactionSchema.pre('findByIdAndUpdate', function (next) {
  const error = new Error('Ledger transactions cannot be updated. Create a new transaction instead.');
  error.statusCode = 400;
  next(error);
});

ledgerTransactionSchema.index({ studentId: 1, createdAt: -1 });
ledgerTransactionSchema.index({ schoolId: 1, createdAt: -1 });

module.exports = mongoose.model('LedgerTransaction', ledgerTransactionSchema);
