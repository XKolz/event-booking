// src/models/WaitingList.js
const db = require("../config/database");

class WaitingList {
  static async add(eventId, userId) {
    const position = await this.getNextPosition(eventId);
    const [entry] = await db("waiting_list")
      .insert({
        event_id: eventId,
        user_id: userId,
        position,
      })
      .returning("*");
    return entry;
  }

  static async getNextPosition(eventId) {
    const result = await db("waiting_list")
      .where({ event_id: eventId })
      .max("position")
      .first();
    return (result.max || 0) + 1;
  }

  static async getNext(eventId) {
    return db("waiting_list")
      .where({ event_id: eventId })
      .orderBy("position", "asc")
      .first();
  }

  static async remove(id) {
    return db("waiting_list").where({ id }).delete();
  }
}

module.exports = WaitingList;
