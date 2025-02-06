// src/config/database.js
require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: "localhost",
    user: "postgres",
    password: "",
    database: "ticket_booking",
  },
  pool: { min: 2, max: 10 },
});

module.exports = db;
