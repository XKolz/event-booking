require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host: "localhost",
      user: "postgres",
      database: "ticket_booking",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
  test: {
    client: "pg",
    connection:
      process.env.TEST_DATABASE_URL ||
      "postgresql://localhost:5432/event_booking_test",
    migrations: {
      directory: "./migrations",
    },
  },
};
