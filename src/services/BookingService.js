// src/services/BookingService.js
const db = require("../config/database");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const WaitingList = require("../models/WaitingList");

class BookingService {
  static async initialize(name, totalTickets) {
    // return Event.create(name, totalTickets);
    if (totalTickets <= 0) {
      throw new Error("Total tickets must be greater than 0");
    }
    return Event.create(name, totalTickets);
    // }
  }

  static async bookTicket(eventId, userId) {
    return db.transaction(async (trx) => {
      const event = await Event.findById(eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      if (event.available_tickets > 0) {
        // Update available tickets
        await Event.updateAvailableTickets(
          eventId,
          event.available_tickets - 1
        );

        // Create booking
        return Booking.create(eventId, userId);
      } else {
        // Add to waiting list
        return WaitingList.add(eventId, userId);
      }
    });
  }

  static async cancelBooking(eventId, userId) {
    return db.transaction(async (trx) => {
      const booking = await Booking.cancel(eventId, userId);

      if (!booking) {
        throw new Error("Booking not found");
      }

      const event = await Event.findById(eventId);
      await Event.updateAvailableTickets(eventId, event.available_tickets + 1);

      // Check waiting list
      const nextInLine = await WaitingList.getNext(eventId);

      if (nextInLine) {
        // Remove from waiting list
        await WaitingList.remove(nextInLine.id);

        // Update available tickets back
        await Event.updateAvailableTickets(eventId, event.available_tickets);

        // Create new booking for waiting list user
        return Booking.create(eventId, nextInLine.user_id);
      }

      return booking;
    });
  }

  static async getEventStatus(eventId) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const waitingListCount = await db("waiting_list")
      .where({ event_id: eventId })
      .count()
      .first();

    return {
      // eventId,
      eventId: Number(eventId),
      availableTickets: event.available_tickets,
      totalTickets: event.total_tickets,
      waitingListCount: parseInt(waitingListCount.count),
    };
  }
  //
  static async getAvailableTickets(eventId) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const bookings = await db("bookings")
      .where({ event_id: eventId })
      .select("id", "user_id", "created_at")
      .orderBy("created_at", "desc");

    return {
      eventId,
      eventName: event.name,
      totalTickets: event.total_tickets,
      availableTickets: event.available_tickets,
      bookedTickets: bookings.length,
      bookings,
    };
  }

  static async getWaitingList(eventId) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const waitingList = await db("waiting_list")
      .where({ event_id: eventId })
      .select("id", "user_id", "position", "created_at")
      .orderBy("position", "asc");

    return {
      eventId,
      eventName: event.name,
      waitingListCount: waitingList.length,
      waitingList,
    };
  }
}

module.exports = BookingService;
