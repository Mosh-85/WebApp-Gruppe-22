import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const qrcodes = sqliteTable("qrcodes", {
  id: int("id").primaryKey({ autoIncrement: true }),
  table_id: int("table_id").notNull(),
  qr_data: text("qr_data"),
});

export type QRCode = typeof qrcodes.$inferSelect;
