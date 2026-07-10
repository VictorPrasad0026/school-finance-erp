const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      unique: true,
    },
    schoolName: String,
    schoolLogo: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String,
    email: String,
    website: String,
    registrationNumber: String,
    affiliationNumber: String,
    receiptPrefix: {
      type: String,
      default: 'RCP',
    },
    receiptNumber: {
      type: Number,
      default: 1000,
    },
    academicYearStart: Number, // month (1-12)
    academicYearEnd: Number,
    currency: {
      type: String,
      default: 'INR',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPassword: String,
    cloudinaryCloudName: String,
    cloudinaryApiKey: String,
    cloudinaryApiSecret: String,
    firebaseConfig: mongoose.Schema.Types.Mixed,
    paymentModes: [String],
    bankDetails: [
      {
        bankName: String,
        accountNumber: String,
        ifscCode: String,
        accountHolder: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
