const Joi = require('joi');

const schemas = {
  // User validation
  userRegistration: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid('director', 'principal', 'accountant', 'admin').required(),
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Student validation
  studentCreate: Joi.object({
    admissionNumber: Joi.string().required(),
    rollNumber: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    fatherName: Joi.string().required(),
    motherName: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string().required(),
    alternatePhone: Joi.string(),
    address: Joi.string().required(),
    class: Joi.string().required(),
    section: Joi.string().required(),
    admissionDate: Joi.date().required(),
    status: Joi.string().valid('active', 'inactive', 'graduated', 'transferred'),
  }),

  // Payment validation
  paymentCreate: Joi.object({
    studentId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    paymentMode: Joi.string().valid('cash', 'upi', 'bank', 'cheque').required(),
    referenceNumber: Joi.string(),
    remarks: Joi.string(),
    monthsPaid: Joi.array().items(Joi.string()),
  }),

  // Expense validation
  expenseCreate: Joi.object({
    category: Joi.string().required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    createdBy: Joi.string().required(),
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
