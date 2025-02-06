// src/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err);

  if (
    err.message === "Event not found" ||
    err.message === "Booking not found"
  ) {
    return res.status(404).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
}

module.exports = errorHandler;
