// I will create a DBHelper class to handle all the database queries
// that are needed for the event booking system.
// This will help to keep the code clean and organized.
// The DBHelper class will have static methods
// to get the waiting list count, get bookings,
// and get waiting list for an event.
// The methods will use the Knex query builder to interact with the database.
const db = require("../config/database");

class DBHelper {
  static async getWaitingListCount(eventId) {
    const result = await db("waiting_list")
      .where({ event_id: eventId })
      .count()
      .first();
    return parseInt(result.count);
  }

  static async getBookings(eventId) {
    return db("bookings")
      .where({ event_id: eventId })
      .select("id", "user_id", "created_at")
      .orderBy("created_at", "desc");
  }

  static async getWaitingList(eventId) {
    return db("waiting_list")
      .where({ event_id: eventId })
      .select("id", "user_id", "position", "created_at")
      .orderBy("position", "asc");
  }
}

module.exports = DBHelper;
