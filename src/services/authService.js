const User = require('../models/User');
const { generateTokens } = require('./tokenService');
const { ValidationError, AuthenticationError, ConflictError } = require('../utils/errors');

const register = async (userData) => {
  const { email, password, firstName, lastName, role, schoolId } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    role,
    schoolId,
  });

  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id);

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new AuthenticationError('User account is inactive');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id);

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  const { verifyRefreshToken } = require('./tokenService');
  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new AuthenticationError('User not found or inactive');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

module.exports = {
  register,
  login,
  refreshAccessToken,
};
