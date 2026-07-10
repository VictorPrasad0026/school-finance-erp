const helmet = require('helmet');
const cors = require('cors');

const securityMiddleware = [
  helmet(),
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  }),
];

module.exports = securityMiddleware;
