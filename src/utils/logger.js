const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const logger = {
  info: (message, data = {}) => {
    const log = `[${getTimestamp()}] INFO: ${message} ${JSON.stringify(data)}`;
    console.log(log);
    fs.appendFileSync(path.join(LOG_DIR, 'info.log'), log + '\n');
  },

  warn: (message, data = {}) => {
    const log = `[${getTimestamp()}] WARN: ${message} ${JSON.stringify(data)}`;
    console.warn(log);
    fs.appendFileSync(path.join(LOG_DIR, 'warn.log'), log + '\n');
  },

  error: (message, data = {}) => {
    const log = `[${getTimestamp()}] ERROR: ${message} ${JSON.stringify(data)}`;
    console.error(log);
    fs.appendFileSync(path.join(LOG_DIR, 'error.log'), log + '\n');
  },

  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const log = `[${getTimestamp()}] DEBUG: ${message} ${JSON.stringify(data)}`;
      console.log(log);
      fs.appendFileSync(path.join(LOG_DIR, 'debug.log'), log + '\n');
    }
  },
};

module.exports = logger;
