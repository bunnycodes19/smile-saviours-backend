const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // ✅ Log full error internally
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  const statusCode = err.statusCode || 500;

  // ✅ DEV vs PROD behavior
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  // ✅ PRODUCTION (NO LEAKS)
  return res.status(statusCode).json({
    success: false,
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
