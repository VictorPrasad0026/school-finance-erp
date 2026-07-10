const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    fees: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        frequency: {
          type: String,
          enum: ['monthly', 'quarterly', 'half-yearly', 'yearly'],
          default: 'monthly',
        },
        dueDate: Date,
        isOptional: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalAmount: Number,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

feeStructureSchema.index({ schoolId: 1, class: 1, academicYear: 1 });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
