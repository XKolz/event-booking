// // src/routes/eventRoutes.js
const express = require("express");
const EventController = require("../controllers/EventController");
const validator = require("../middleware/validator");
const {
  validateInitialize,
  validateBook,
  validateCancel,
  validateEventId,
} = require("../validation/eventValidator");

const router = express.Router();

router.post(
  "/initialize",
  validateInitialize,
  validator,
  EventController.initialize
);
router.post("/book", validateBook, validator, EventController.book);
router.post("/cancel", validateCancel, validator, EventController.cancel);
router.get(
  "/status/:eventId",
  validateEventId,
  validator,
  EventController.status
);
router.get(
  "/:eventId/tickets",
  validateEventId,
  validator,
  EventController.getAvailableTickets
);
router.get(
  "/:eventId/waiting-list",
  validateEventId,
  validator,
  EventController.getWaitingList
);

module.exports = router;
