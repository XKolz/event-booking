// src/controllers/EventController.js
const BookingService = require("../services/BookingService");

class EventController {
  static async initialize(req, res, next) {
    try {
      const { name, totalTickets } = req.body;
      const event = await BookingService.initialize(name, totalTickets);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  static async book(req, res, next) {
    try {
      const { eventId, userId } = req.body;
      const result = await BookingService.bookTicket(eventId, userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req, res, next) {
    try {
      const { eventId, userId } = req.body;
      const result = await BookingService.cancelBooking(eventId, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async status(req, res, next) {
    try {
      const { eventId } = req.params;
      const status = await BookingService.getEventStatus(eventId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
  //
  // New controller methods
  static async getAvailableTickets(req, res, next) {
    try {
      const { eventId } = req.params;
      const tickets = await BookingService.getAvailableTickets(eventId);
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }

  static async getWaitingList(req, res, next) {
    try {
      const { eventId } = req.params;
      const waitingList = await BookingService.getWaitingList(eventId);
      res.json(waitingList);
    } catch (error) {
      next(error);
    }
  }
  // }
}

module.exports = EventController;
