const mongoose = require('mongoose');
const { STUDENT_STATUS } = require('../utils/constants');

const studentSchema = new mongoose.Schema(
  {
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    alternatePhone: String,
    fatherName: {
      type: String,
      required: true,
    },
    fatherPhone: String,
    motherName: {
      type: String,
      required: true,
    },
    motherPhone: String,
    address: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    photoUrl: String,
    admissionDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STUDENT_STATUS),
      default: STUDENT_STATUS.ACTIVE,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

studentSchema.index({ schoolId: 1, admissionNumber: 1 });
studentSchema.index({ class: 1, section: 1 });

module.exports = mongoose.model('Student', studentSchema);
