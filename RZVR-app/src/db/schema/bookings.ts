import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const bookings = sqliteTable("bookings", {
  id: int("id").primaryKey({ autoIncrement: true }),
  table_id: int("table_id").notNull(),
  available_time_id: int("available_time_id"),
  customer_first_name: text("customer_first_name", { length: 100 }),
  customer_last_name: text("customer_last_name", { length: 100 }),
  customer_email: text("customer_email", { length: 255 }),
  from_date_time: text("from_date_time").notNull(),
  until_date_time: text("until_date_time").notNull(),
  status: text("status", { length: 50 }),
  vipps_transaction_id: text("vipps_transaction_id", { length: 255 }),
  created_at: text("created_at"),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert
