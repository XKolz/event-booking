const BookingService = require("../../src/services/BookingService");
const db = require("../../src/config/database");

describe("BookingService", () => {
  beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe("initialize", () => {
    it("should create a new event with specified tickets", async () => {
      const event = await BookingService.initialize("Concert", 100);
      expect(event.name).toBe("Concert");
      expect(event.total_tickets).toBe(100);
      expect(event.available_tickets).toBe(100);
    });

    it("should fail with invalid ticket count", async () => {
      await expect(BookingService.initialize("Concert", -1)).rejects.toThrow();
    });
  });

  describe("bookTicket", () => {
    let eventId;

    beforeEach(async () => {
      const event = await BookingService.initialize("Concert", 2);
      eventId = event.id;
    });

    it("should book a ticket when available", async () => {
      const booking = await BookingService.bookTicket(eventId, "user1");
      expect(booking.user_id).toBe("user1");
      expect(booking.event_id).toBe(eventId);
    });

    it("should decrease available tickets after booking", async () => {
      await BookingService.bookTicket(eventId, "user1");
      const status = await BookingService.getEventStatus(eventId);
      expect(status.availableTickets).toBe(1);
    });

    it("should add to waiting list when sold out", async () => {
      await BookingService.bookTicket(eventId, "user1");
      await BookingService.bookTicket(eventId, "user2");
      const waitingList = await BookingService.bookTicket(eventId, "user3");
      expect(waitingList.user_id).toBe("user3");
      expect(waitingList.position).toBe(1);
    });

    it("should fail when event does not exist", async () => {
      await expect(BookingService.bookTicket(999, "user1")).rejects.toThrow(
        "Event not found"
      );
    });
  });

  describe("cancelBooking", () => {
    let eventId;

    beforeEach(async () => {
      const event = await BookingService.initialize("Concert", 1);
      eventId = event.id;
    });

    it("should cancel existing booking", async () => {
      await BookingService.bookTicket(eventId, "user1");
      const result = await BookingService.cancelBooking(eventId, "user1");
      expect(result).toBeTruthy();
    });

    it("should increase available tickets after cancellation", async () => {
      await BookingService.bookTicket(eventId, "user1");
      await BookingService.cancelBooking(eventId, "user1");
      const status = await BookingService.getEventStatus(eventId);
      expect(status.availableTickets).toBe(1);
    });

    it("should book ticket for first person in waiting list after cancellation", async () => {
      await BookingService.bookTicket(eventId, "user1");
      await BookingService.bookTicket(eventId, "user2"); // goes to waiting list
      await BookingService.cancelBooking(eventId, "user1");

      const status = await BookingService.getEventStatus(eventId);
      expect(status.availableTickets).toBe(0);

      const waitingList = await BookingService.getWaitingList(eventId);
      expect(waitingList.waitingListCount).toBe(0);
    });

    it("should fail when booking does not exist", async () => {
      await expect(
        BookingService.cancelBooking(eventId, "nonexistent")
      ).rejects.toThrow("Booking not found");
    });
  });

  describe("getEventStatus", () => {
    let eventId;

    beforeEach(async () => {
      const event = await BookingService.initialize("Concert", 2);
      eventId = event.id;
    });

    it("should return correct event status", async () => {
      const status = await BookingService.getEventStatus(eventId);
      expect(status).toEqual({
        eventId,
        availableTickets: 2,
        totalTickets: 2,
        waitingListCount: 0,
      });
    });

    it("should show correct waiting list count", async () => {
      await BookingService.bookTicket(eventId, "user1");
      await BookingService.bookTicket(eventId, "user2");
      await BookingService.bookTicket(eventId, "user3"); // waiting list
      await BookingService.bookTicket(eventId, "user4"); // waiting list

      const status = await BookingService.getEventStatus(eventId);
      expect(status.waitingListCount).toBe(2);
    });
  });

  describe("getAvailableTickets", () => {
    let eventId;

    beforeEach(async () => {
      const event = await BookingService.initialize("Concert", 2);
      eventId = event.id;
    });

    it("should return correct ticket information", async () => {
      await BookingService.bookTicket(eventId, "user1");
      const tickets = await BookingService.getAvailableTickets(eventId);

      expect(tickets.totalTickets).toBe(2);
      expect(tickets.availableTickets).toBe(1);
      expect(tickets.bookedTickets).toBe(1);
      expect(tickets.bookings).toHaveLength(1);
    });
  });

  describe("getWaitingList", () => {
    let eventId;

    beforeEach(async () => {
      const event = await BookingService.initialize("Concert", 1);
      eventId = event.id;
    });

    it("should return correct waiting list", async () => {
      await BookingService.bookTicket(eventId, "user1");
      await BookingService.bookTicket(eventId, "user2"); // waiting list

      const waitingList = await BookingService.getWaitingList(eventId);
      expect(waitingList.waitingListCount).toBe(1);
      expect(waitingList.waitingList[0].user_id).toBe("user2");
      expect(waitingList.waitingList[0].position).toBe(1);
    });
  });
});
