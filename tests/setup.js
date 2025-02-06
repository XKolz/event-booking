// const db = require("../src/config/database");

// beforeAll(async () => {
//   await db.migrate.rollback(undefined, true);
//   await db.migrate.latest();
// });

// afterAll(async () => {
//   await db.destroy();
// });

// beforeEach(async () => {
//   await db("waiting_list").del();
//   await db("bookings").del();
//   await db("events").del();
// });
const db = require("../src/config/database");

beforeAll(async () => {
  try {
    // Make sure to unlock migrations first
    await db.migrate.unlock();
    // Rollback all migrations
    await db.migrate.rollback(undefined, true);
    // Run migrations
    await db.migrate.latest();
  } catch (error) {
    console.error("Setup error:", error);
  }
});

afterAll(async () => {
  await db.destroy();
});

beforeEach(async () => {
  try {
    // Clear all tables before each test
    await db("waiting_list").del();
    await db("bookings").del();
    await db("events").del();
  } catch (error) {
    console.error("BeforeEach error:", error);
  }
});
