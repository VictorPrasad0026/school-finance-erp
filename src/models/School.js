const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    registrationNumber: String,
    affiliationNumber: String,
    logo: String,
    website: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ['basic', 'pro', 'enterprise'],
      default: 'basic',
    },
    maxBranches: {
      type: Number,
      default: 1,
    },
    maxUsers: {
      type: Number,
      default: 10,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('School', schoolSchema);
