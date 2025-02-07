// src/middleware/errorHandler.js
const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;
