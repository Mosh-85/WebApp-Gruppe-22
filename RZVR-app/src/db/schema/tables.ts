import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const tables = sqliteTable("tables", {
  id: int("id").primaryKey(),
  seats: int("seats"),
  status: text("status", { length: 50 }),
});

export type TableRow = typeof tables.$inferSelect;
