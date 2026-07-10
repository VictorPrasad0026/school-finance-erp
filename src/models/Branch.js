const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: String,
    city: String,
    state: String,
    phone: String,
    email: String,
    branchCode: {
      type: String,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

branchSchema.index({ schoolId: 1 });

module.exports = mongoose.model('Branch', branchSchema);
