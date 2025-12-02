import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import * as schema from "../../db/schema";
import { bookings } from "../../db/schema";

const sqlite = new Database(
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/fc50b649db51ed0c303ff2c4b7c0eca2da269cc3dfc7ce40615fc37a7b53366c.sqlite"
);

const db = drizzle(sqlite, { schema });

async function seedBooking() {
  const tableId = 2;

  // Create explicit 19:00 → 20:00 time range for today
  const today = new Date();
  today.setSeconds(0, 0);

  const from = new Date(today);
  from.setHours(19, 0, 0, 0);

  const until = new Date(today);
  until.setHours(20, 0, 0, 0);

  const now = new Date();

  const row = db
    .insert(bookings)
    .values({
      table_id: tableId,
      customer_first_name: "Test",
      customer_last_name: "User",
      customer_email: "test@example.com",
      from_date_time: from.toISOString(),
      until_date_time: until.toISOString(),
      status: "active",
      created_at: now.toISOString(),
    })
    .returning({ id: bookings.id })
    .get();

  console.log(`✅ Seeded booking #${row.id} for table ${tableId}`);
}

seedBooking();
