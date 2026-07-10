const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    class: String,
    section: String,
    discountType: {
      type: String,
      enum: ['fixed', 'percentage', 'scholarship'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    reason: String,
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
  },
  { timestamps: true }
);

discountSchema.index({ schoolId: 1, month: 1 });

module.exports = mongoose.model('Discount', discountSchema);
