const joi = require('joi');

const schemas = {
  userRegistration: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    role: joi.string().valid('director', 'principal', 'accountant', 'admin'),
    schoolId: joi.string().required(),
  }),

  userLogin: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),

  studentCreate: joi.object({
    admissionNumber: joi.string().required(),
    rollNumber: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email(),
    phone: joi.string().required(),
    alternatePhone: joi.string(),
    fatherName: joi.string().required(),
    fatherPhone: joi.string(),
    motherName: joi.string().required(),
    motherPhone: joi.string(),
    address: joi.string().required(),
    class: joi.string().required(),
    section: joi.string().required(),
    admissionDate: joi.date().required(),
  }),

  paymentCreate: joi.object({
    studentId: joi.string().required(),
    amount: joi.number().min(0).required(),
    paymentMode: joi.string().valid('cash', 'cheque', 'bank_transfer', 'upi').required(),
    referenceNumber: joi.string(),
    chequeNumber: joi.string(),
    bankName: joi.string(),
    upiId: joi.string(),
    transactionId: joi.string(),
    monthsPaid: joi.array().items(joi.string()),
    discount: joi.number().min(0),
    remarks: joi.string(),
  }),

  expenseCreate: joi.object({
    category: joi.string().required(),
    description: joi.string().required(),
    amount: joi.number().min(0).required(),
    expenseDate: joi.date(),
    invoiceNumber: joi.string(),
    remarks: joi.string(),
  }),
};

const validate = (data, schema) => {
  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
};

module.exports = {
  schemas,
  validate,
};
