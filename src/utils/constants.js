const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  GRADUATED: 'graduated',
  TRANSFERRED: 'transferred',
};

const TRANSACTION_TYPES = {
  PAYMENT: 'payment',
  DISCOUNT: 'discount',
  EXPENSE: 'expense',
  REFUND: 'refund',
  ADJUSTMENT: 'adjustment',
};

const PAYMENT_MODES = {
  CASH: 'cash',
  CHEQUE: 'cheque',
  BANK_TRANSFER: 'bank_transfer',
  UPI: 'upi',
  ONLINE: 'online',
};

const EXPENSE_CATEGORIES = {
  SALARY: 'salary',
  UTILITIES: 'utilities',
  MAINTENANCE: 'maintenance',
  SUPPLIES: 'supplies',
  TRANSPORT: 'transport',
  EQUIPMENT: 'equipment',
  OTHER: 'other',
};

const USER_ROLES = {
  DIRECTOR: 'director',
  PRINCIPAL: 'principal',
  ACCOUNTANT: 'accountant',
  ADMIN: 'admin',
};

module.exports = {
  STUDENT_STATUS,
  TRANSACTION_TYPES,
  PAYMENT_MODES,
  EXPENSE_CATEGORIES,
  USER_ROLES,
};
