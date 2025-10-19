import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const staff = sqliteTable("staff", {
  id: int("id").primaryKey({ autoIncrement: true }),
  first_name: text("first_name", { length: 100 }),
  last_name: text("last_name", { length: 100 }),
  email: text("email", { length: 255 }).notNull(),
  password: text("password", { length: 255 }).notNull(),
  role: text("role", { length: 50 }),
  created_at: text("created_at"),
});

export type Staff = typeof staff.$inferSelect;
