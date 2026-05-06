/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
    },
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      status: 404,
      message: "Route not found",
    },
  });
};

export default {
  errorHandler,
  notFoundHandler,
};
