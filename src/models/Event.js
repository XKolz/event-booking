// src/models/Event.js
const db = require("../config/database");

class Event {
  static async create(name, totalTickets) {
    const [event] = await db("events")
      .insert({
        name: name,
        total_tickets: totalTickets,
        available_tickets: totalTickets,
      })
      .returning("*");
    return event;
  }

  static async findById(id) {
    return db("events").where({ id }).first();
  }

  static async updateAvailableTickets(id, count) {
    const [updated] = await db("events")
      .where({ id })
      .update({ available_tickets: count })
      .returning("*");
    return updated;
  }
}

module.exports = Event;
