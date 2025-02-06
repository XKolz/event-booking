// src/models/Booking.js
const db = require("../config/database");

class Booking {
  static async create(eventId, userId) {
    const [booking] = await db("bookings")
      .insert({
        event_id: eventId,
        user_id: userId,
      })
      .returning("*");
    return booking;
  }

  static async cancel(eventId, userId) {
    const [cancelled] = await db("bookings")
      .where({ event_id: eventId, user_id: userId, is_active: true })
      .update({ is_active: false })
      .returning("*");
    return cancelled;
  }
}

module.exports = Booking;
