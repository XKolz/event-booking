// src/routes/eventRoutes.js
const express = require("express");
const { body, param } = require("express-validator");
const EventController = require("../controllers/EventController");
const validator = require("../middleware/validator");

const router = express.Router();

router.post(
  "/initialize",
  [body("totalTickets").isInt({ min: 1 })],
  validator,
  EventController.initialize
);

router.post(
  "/book",
  [body("eventId").isInt({ min: 1 }), body("userId").isString().notEmpty()],
  validator,
  EventController.book
);

router.post(
  "/cancel",
  [body("eventId").isInt({ min: 1 }), body("userId").isString().notEmpty()],
  validator,
  EventController.cancel
);

router.get(
  "/status/:eventId",
  [param("eventId").isInt({ min: 1 })],
  validator,
  EventController.status
);

//
router.get(
  "/:eventId/tickets",
  [param("eventId").isInt({ min: 1 })],
  validator,
  EventController.getAvailableTickets
);

router.get(
  "/:eventId/waiting-list",
  [param("eventId").isInt({ min: 1 })],
  validator,
  EventController.getWaitingList
);

module.exports = router;
