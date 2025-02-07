const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 75,
  message: {
    status: 429,
    error: "Too many requests, please try again later",
  },
  headers: true, // Send `X-RateLimit-*` headers
});

const bookingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10, // Allow only 10 booking attempts per user within 5 minutes
  keyGenerator: (req) => req.body.userId,
  message: {
    status: 429,
    error: "Too many requests, please try again later",
  },
});

// Stricter rate limiter for event initialization (1 per 10 seconds)
const initializeLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 10, // Only 10 initialization allowed per 10 seconds
  message: {
    status: 429,
    error: "You are initializing events too frequently. Please wait.",
  },
  headers: true,
});

module.exports = { apiLimiter, bookingLimiter, initializeLimiter };
