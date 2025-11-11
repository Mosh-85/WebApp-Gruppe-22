import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const available_times = sqliteTable("available_times", {
  id: int("id").primaryKey({ autoIncrement: true }),
  table_id: int("table_id").notNull(),
  day_of_week: text("day_of_week", { length: 20 }),
  open_time: text("open_time").notNull(),
  close_time: text("close_time").notNull(),
  slot_duration_minutes: int("slot_duration_minutes"),
});

export type AvailableTime = typeof available_times.$inferSelect;
