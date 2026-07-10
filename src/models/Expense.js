const mongoose = require('mongoose');
const { EXPENSE_CATEGORIES } = require('../utils/constants');

const expenseSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(EXPENSE_CATEGORIES),
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    billUrl: String,
    invoiceNumber: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    remarks: String,
  },
  { timestamps: true }
);

expenseSchema.index({ schoolId: 1, expenseDate: -1 });
expenseSchema.index({ category: 1, expenseDate: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
