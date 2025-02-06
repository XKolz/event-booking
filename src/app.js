// src/app.js
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const eventRoutes = require("./routes/eventRoutes");
const db = require("./config/database");

const app = express();

// Test database connection
db.raw("SELECT 1")
  .then(() => {
    console.log("✅ PostgreSQL Connected");
  })
  .catch((e) => {
    console.error("❌ PostgreSQL Connection Error");
    console.error(e);
  });

app.use(express.json());
app.use("/api", eventRoutes);
app.use(errorHandler);

module.exports = app;
