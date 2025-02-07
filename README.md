# Event Booking System

A Node.js-based event booking system that handles concurrent ticket bookings with waiting list functionality.

## Features

- Initialize events with a set number of available tickets
- Book tickets with concurrent booking support
- Automatic waiting list management
- Ticket cancellation with automatic assignment to waiting list users
- View available tickets and waiting list status

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Knex.js (SQL Query Builder)
- Jest (Testing)
- Supertest (API Testing)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd event-booking
```

2. Install dependencies:

```bash
npm install
```

3. Set up your database:

```bash
createdb event_booking
createdb event_booking_test
```

4. Create a .env file:

```env
DATABASE_URL=
TEST_DATABASE_URL=
DATABASE_HOST=
DATABASE_USER=
DATABASE_NAME=
NODE_ENV=development
```

5. Run migrations:

```bash
npx knex migrate:latest
```

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## API Endpoints

### Postman URL

https://documenter.getpostman.com/view/23652017/2sAYX8HLxX

### Initialize Event

```http
POST /api/initialize
Content-Type: application/json

{
  "name": "Concert",
  "totalTickets": 100
}
```

### Book Ticket

```http
POST /api/book
Content-Type: application/json

{
  "eventId": 1,
  "userId": "user123"
}
```

### Cancel Booking

```http
POST /api/cancel
Content-Type: application/json

{
  "eventId": 1,
  "userId": "user123"
}
```

### Get Event Status

```http
GET /api/status/:eventId
```

### Get Available Tickets

```http
GET /api/:eventId/tickets
```

### Get Waiting List

```http
GET /api/:eventId/waiting-list
```

## Database Schema

### events

- id (PK)
- name
- total_tickets
- available_tickets
- created_at
- updated_at

### bookings

- id (PK)
- event_id (FK)
- user_id
- is_active
- created_at
- updated_at

### waiting_list

- id (PK)
- event_id (FK)
- user_id
- position
- created_at
- updated_at

## Error Handling

The system handles various error cases:

- Event not found
- No available tickets
- Invalid ticket count
- Booking not found
- Concurrent booking conflicts

## Testing Strategy

The project includes both unit and integration tests:

### Unit Tests

- Service layer testing
- Individual function testing
- Edge case validation

### Integration Tests

- API endpoint testing
- Database interaction testing
- End-to-end flow testing

## Project Structure

```
event-booking/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── EventController.js
│   ├── middleware/
│   │   ├── validator.js
│   │   ├── errorHandler.js
│   │   └── asyncHandler.js
│   ├── models/
│   │   ├── Event.js
│   │   ├── Booking.js
│   │   └── WaitingList.js
│   ├── routes/
│   │   └── eventRoutes.js
│   ├── services/
│   │   └── BookingService.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── responseHandler.js
│   └── app.js
├── tests/
│   ├── integration/
│   │   └── api.test.js
│   ├── unit/
│   │   └── bookingService.test.js
│   └── setup.js
├── migrations/
├── knexfile.js
├── package.json
└── server.js
```
