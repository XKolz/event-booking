const { body, param } = require("express-validator");

const validateInitialize = [
  body("totalTickets")
    .isInt({ min: 1 })
    .withMessage("Total tickets must be greater than 0"),
];

const validateBook = [
  body("eventId").isInt({ min: 1 }).withMessage("Invalid event ID"),
  body("userId").isString().notEmpty().withMessage("User ID is required"),
];

const validateCancel = [...validateBook];

const validateEventId = [
  param("eventId").isInt({ min: 1 }).withMessage("Invalid event ID"),
];

module.exports = {
  validateInitialize,
  validateBook,
  validateCancel,
  validateEventId,
};
