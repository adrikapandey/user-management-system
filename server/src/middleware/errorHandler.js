export function notFoundHandler(_req, res) {
  res.status(404).json({
    message: "Route not found"
  });
}

export function errorHandler(error, _req, res, _next) {
  if (error?.code === 11000 && error?.keyPattern?.email) {
    res.status(409).json({
      message: "A user with this email already exists"
    });
    return;
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error"
  });
}
