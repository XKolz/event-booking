require("dotenv").config();

const sharedConfig = {
  client: "pg",
  migrations: {
    directory: "./migrations",
  },
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: process.env.DATABASE_URL || {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE_NAME,
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
  test: {
    ...sharedConfig,
    connection: process.env.TEST_DATABASE_URL,
  },
};
