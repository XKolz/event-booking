const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/config/database");

describe("API Integration Tests", () => {
  beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe("POST /api/initialize", () => {
    it("should initialize an event", async () => {
      const response = await request(app)
        .post("/api/initialize")
        .send({ name: "Concert", totalTickets: 100 });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Concert");
      expect(response.body.total_tickets).toBe(100);
      expect(response.body.available_tickets).toBe(100);
    });

    it("should validate input", async () => {
      const response = await request(app)
        .post("/api/initialize")
        .send({ totalTickets: -1 });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/book", () => {
    let eventId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/initialize")
        .send({ name: "Concert", totalTickets: 1 });
      eventId = response.body.id;
    });

    it("should book a ticket when available", async () => {
      const response = await request(app).post("/api/book").send({
        eventId,
        userId: "user1",
      });

      expect(response.status).toBe(201);
      expect(response.body.user_id).toBe("user1");
    });

    it("should add to waiting list when sold out", async () => {
      // Book the only available ticket
      await request(app).post("/api/book").send({
        eventId,
        userId: "user1",
      });

      // Try to book when sold out
      const response = await request(app).post("/api/book").send({
        eventId,
        userId: "user2",
      });

      expect(response.status).toBe(201);
      expect(response.body.position).toBe(1);
    });
  });

  describe("POST /api/cancel", () => {
    let eventId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/initialize")
        .send({ name: "Concert", totalTickets: 1 });
      eventId = response.body.id;
    });

    it("should cancel a booking", async () => {
      // First book a ticket
      await request(app).post("/api/book").send({
        eventId,
        userId: "user1",
      });

      // Then cancel it
      const response = await request(app).post("/api/cancel").send({
        eventId,
        userId: "user1",
      });

      expect(response.status).toBe(200);
    });

    it("should assign ticket to waiting list user after cancellation", async () => {
      // Book the only ticket
      await request(app).post("/api/book").send({
        eventId,
        userId: "user1",
      });

      // Add user2 to waiting list
      await request(app).post("/api/book").send({
        eventId,
        userId: "user2",
      });

      // Cancel user1's booking
      await request(app).post("/api/cancel").send({
        eventId,
        userId: "user1",
      });

      // Check event status
      const response = await request(app).get(`/api/status/${eventId}`);

      expect(response.body.availableTickets).toBe(0);
      expect(response.body.waitingListCount).toBe(0);
    });
  });

  describe("GET /api/status/:eventId", () => {
    let eventId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/initialize")
        .send({ name: "Concert", totalTickets: 2 });
      eventId = response.body.id;
    });

    it("should return event status", async () => {
      const response = await request(app).get(`/api/status/${eventId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        eventId: expect.any(Number),
        availableTickets: 2,
        totalTickets: 2,
        waitingListCount: 0,
      });
    });
  });

  describe("GET /api/:eventId/tickets", () => {
    let eventId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/initialize")
        .send({ name: "Concert", totalTickets: 2 });
      eventId = response.body.id;
    });

    it("should return ticket information", async () => {
      await request(app).post("/api/book").send({
        eventId,
        userId: "user1",
      });

      const response = await request(app).get(`/api/${eventId}/tickets`);

      expect(response.status).toBe(200);
      expect(response.body.totalTickets).toBe(2);
      expect(response.body.availableTickets).toBe(1);
      expect(response.body.bookedTickets).toBe(1);
      expect(response.body.bookings).toHaveLength(1);
    });
  });

  describe("GET /api/:eventId/waiting-list", () => {
    let eventId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/initialize")
        .send({ name: "Concert", totalTickets: 1 });
      eventId = response.body.id;
    });

    it("should return waiting list", async () => {
      // Book the only ticket
      await request(app).post("/api/book").send({
        eventId,
        userId: "user1",
      });

      // Add to waiting list
      await request(app).post("/api/book").send({
        eventId,
        userId: "user2",
      });

      const response = await request(app).get(`/api/${eventId}/waiting-list`);

      expect(response.status).toBe(200);
      expect(response.body.waitingListCount).toBe(1);
      expect(response.body.waitingList).toHaveLength(1);
      expect(response.body.waitingList[0].user_id).toBe("user2");
      expect(response.body.waitingList[0].position).toBe(1);
    });
  });
});
