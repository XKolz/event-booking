/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("events", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.integer("total_tickets").notNullable();
      table.integer("available_tickets").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("bookings", function (table) {
      table.increments("id").primary();
      table
        .integer("event_id")
        .references("id")
        .inTable("events")
        .onDelete("CASCADE");
      table.string("user_id").notNullable();
      table.boolean("is_active").defaultTo(true);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("waiting_list", function (table) {
      table.increments("id").primary();
      table
        .integer("event_id")
        .references("id")
        .inTable("events")
        .onDelete("CASCADE");
      table.string("user_id").notNullable();
      table.integer("position").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("waiting_list")
    .dropTable("bookings")
    .dropTable("events");
};
