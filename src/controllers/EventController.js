// src/controllers/EventController.js
const BookingService = require("../services/BookingService");
const { successResponse } = require("../utils/responseHandler");
const asyncHandler = require("../middleware/asyncHandler");

class EventController {
  static initialize = asyncHandler(async (req, res) => {
    const { name, totalTickets } = req.body;
    const event = await BookingService.initialize(name, totalTickets);
    successResponse(res, 201, "Event initialized successfully", event);
  });

  static book = asyncHandler(async (req, res) => {
    const { eventId, userId } = req.body;
    const result = await BookingService.bookTicket(eventId, userId);
    successResponse(res, 201, "Booking successful", result);
  });

  static cancel = asyncHandler(async (req, res) => {
    const { eventId, userId } = req.body;
    const result = await BookingService.cancelBooking(eventId, userId);
    successResponse(res, 200, "Booking canceled successfully", result);
  });

  static status = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const status = await BookingService.getEventStatus(eventId);
    successResponse(res, 200, "Event status retrieved", status);
  });

  static getAvailableTickets = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const tickets = await BookingService.getAvailableTickets(eventId);
    successResponse(res, 200, "Available tickets retrieved", tickets);
  });

  static getWaitingList = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const waitingList = await BookingService.getWaitingList(eventId);
    successResponse(res, 200, "Waiting list retrieved", waitingList);
  });
}

module.exports = EventController;
