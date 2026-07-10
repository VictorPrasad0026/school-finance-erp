# School Finance ERP - Backend

A comprehensive Node.js + Express backend for school financial management system.

## Features

- **User Authentication** - JWT with refresh tokens
- **Student Management** - Complete student profiles and tracking
- **Ledger System** - Immutable transaction history
- **Payment Processing** - Multiple payment modes support
- **Expense Tracking** - Categorized expense management
- **Role-Based Access** - Director, Principal, Accountant roles
- **Database** - MongoDB with Mongoose
- **Security** - Helmet, CORS, Rate limiting, bcrypt

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update with your configuration:
- MongoDB URI
- JWT secrets
- Cloudinary credentials
- Email configuration

## Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Endpoints

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

## Database Schema

Models:
- **User** - System users with roles
- **Student** - Student information
- **LedgerTransaction** - Immutable financial transactions
- **Payment** - Payment records
- **Expense** - Expense records
- **FeeStructure** - Fee configuration
- **Receipt** - Payment receipts
- **Discount** - Student discounts
- **Refund** - Refund requests

## Testing

```bash
npm test
```

## License

MIT
