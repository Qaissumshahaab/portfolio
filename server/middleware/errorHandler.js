/**
 * middleware/errorHandler.js
 * ───────────────────────────
 * Global Express error handler.
 * Catches any error thrown via next(err) in routes/controllers.
 */

const errorHandler = (err, req, res, next) => {
  // Log the error stack in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Unhandled Error:', err.stack);
  } else {
    console.error('🔴 Error:', err.message);
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500
      ? 'Internal server error. Please try again later.'
      : err.message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
