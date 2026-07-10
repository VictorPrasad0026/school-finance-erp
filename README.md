# School Finance ERP - Backend

Node.js + Express backend for comprehensive school financial management system.

## Quick Start

### Prerequisites
- Node.js >= 16.0.0
- MongoDB
- npm >= 8.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VictorPrasad0026/school-finance-erp.git
cd school-finance-erp
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## Features

✅ **User Authentication** - JWT with refresh tokens
✅ **Role-Based Access** - Director, Principal, Accountant roles
✅ **Student Management** - Complete student profiles
✅ **Ledger System** - Immutable transaction history
✅ **Payment Processing** - Multiple payment modes
✅ **Expense Tracking** - Categorized expense management
✅ **Receipt Generation** - Auto-generated receipts with QR codes
✅ **Discount Management** - Student-specific discounts
✅ **Reporting** - Daily, monthly, and annual reports
✅ **Analytics** - Dashboard with key metrics
✅ **Security** - Helmet, CORS, Rate limiting, bcrypt
✅ **Database** - MongoDB with Mongoose

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Ledger
- `GET /api/ledger/student/:studentId` - Get student ledger
- `GET /api/ledger/summary/:schoolId` - Get ledger summary

### Payments
- `POST /api/payments` - Record payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID

### Expenses
- `POST /api/expenses` - Record expense
- `GET /api/expenses` - Get all expenses

### Receipts
- `POST /api/receipts` - Generate receipt
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get receipt by ID

### Discounts
- `POST /api/discounts` - Create discount
- `GET /api/discounts` - Get all discounts
- `PATCH /api/discounts/:id/approve` - Approve discount

### Reports
- `GET /api/reports/collection/daily` - Daily collection report
- `GET /api/reports/collection/monthly` - Monthly collection report
- `GET /api/reports/outstanding` - Outstanding fees report
- `GET /api/reports/expenses` - Expense report

### Analytics
- `GET /api/analytics/dashboard` - Dashboard summary
- `GET /api/analytics/cash-flow` - Revenue vs Expenses

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.js  # Database connection
│   └── env.js       # Environment config
├── middleware/      # Express middleware
│   ├── auth.js      # Authentication & Authorization
│   ├── security.js  # Security middleware
│   ├── errorHandler.js
│   └── rateLimiter.js
├── models/          # Mongoose models
│   ├── User.js
│   ├── Student.js
│   ├── Payment.js
│   ├── Expense.js
│   ├── Receipt.js
│   ├── Discount.js
│   ├── Refund.js
│   ├── FeeStructure.js
│   ├── LedgerTransaction.js
│   ├── AuditLog.js
│   ├── School.js
│   ├── Branch.js
│   └── Settings.js
├── routes/          # API routes
│   ├── auth.js
│   ├── students.js
│   ├── payments.js
│   ├── expenses.js
│   ├── receipts.js
│   ├── discounts.js
│   ├── ledger.js
│   ├── reports.js
│   └── analytics.js
├── services/        # Business logic
│   ├── authService.js
│   ├── tokenService.js
│   ├── studentService.js
│   └── paymentService.js
├── utils/           # Utility functions
│   ├── validators.js
│   ├── constants.js
│   ├── errors.js
│   ├── logger.js
│   └── helpers.js
├── app.js           # Express app setup
└── index.js         # Server entry point
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school-finance-erp
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

## Testing

```bash
npm test
```

## Development

```bash
npm run dev    # Start with nodemon
npm run lint   # Check code style
npm run lint:fix # Fix code style issues
```

## Database Models

### User
- Role-based access control
- JWT authentication
- Password hashing with bcrypt

### Student
- Complete student information
- Parent/Guardian details
- Class and section assignment
- Admission tracking

### LedgerTransaction
- Immutable financial records
- Transaction types: Payment, Discount, Expense, Refund
- Balance tracking

### Payment
- Multiple payment modes
- Month-wise fee tracking
- Discount application
- Reference tracking

### Expense
- Categorized expenses
- Invoice tracking
- Approval workflow

### Receipt
- Auto-generated receipt numbers
- QR code generation
- Payment linking

## Security Features

- ✅ JWT Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Password Hashing with bcrypt
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ Input Validation with Joi
- ✅ Error Handling
- ✅ Audit Logging

## Error Handling

All errors are returned in a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Support

For issues and feature requests, please create an issue on GitHub.

## License

MIT License - see LICENSE file for details
