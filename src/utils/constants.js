module.exports = {
  // User Roles
  ROLES: {
    DIRECTOR: 'director',
    PRINCIPAL: 'principal',
    ACCOUNTANT: 'accountant',
    ADMIN: 'admin',
  },

  // Transaction Types
  TRANSACTION_TYPES: {
    FEE_GENERATED: 'fee_generated',
    PAYMENT: 'payment',
    DISCOUNT: 'discount',
    SCHOLARSHIP: 'scholarship',
    REFUND: 'refund',
    LATE_FEE: 'late_fee',
    EXPENSE: 'expense',
    ADJUSTMENT: 'adjustment',
    TRANSPORT_WAIVER: 'transport_waiver',
  },

  // Payment Modes
  PAYMENT_MODES: {
    CASH: 'cash',
    UPI: 'upi',
    BANK: 'bank',
    CHEQUE: 'cheque',
  },

  // Expense Categories
  EXPENSE_CATEGORIES: {
    SALARY: 'salary',
    ELECTRICITY: 'electricity',
    TRANSPORT: 'transport',
    FUEL: 'fuel',
    INTERNET: 'internet',
    FURNITURE: 'furniture',
    BUILDING: 'building',
    MAINTENANCE: 'maintenance',
    WATER: 'water',
    EVENTS: 'events',
    STATIONERY: 'stationery',
    MISCELLANEOUS: 'miscellaneous',
  },

  // Student Status
  STUDENT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    GRADUATED: 'graduated',
    TRANSFERRED: 'transferred',
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    WHATSAPP: 'whatsapp',
    SMS: 'sms',
    EMAIL: 'email',
  },
};
