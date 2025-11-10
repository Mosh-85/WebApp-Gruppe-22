import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tables = sqliteTable("tables", {
    id: int("id").primaryKey({ autoIncrement: true}),
    seats: int("seats").notNull(),
    status: text().notNull(),
})

export type Table = typeof tables.$inferSelect