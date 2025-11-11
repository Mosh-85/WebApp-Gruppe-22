import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const waitlist = sqliteTable("waitlist", {
  id: int("id").primaryKey({ autoIncrement: true }),
  table_id: int("table_id").notNull(),
  customer_name: text("customer_name", { length: 150 }),
  customer_email: text("customer_email", { length: 255 }),
  date_time: text("date_time"),
  status: text("status", { length: 50 }),
});

export type WaitlistRow = typeof waitlist.$inferSelect;
