import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import * as schema from "../../db/schema";
import { bookings } from "../../db/schema";

//import * as schema from "./schema";
//import { bookings } from "./schema";

// 👇 IMPORTANT: use YOUR real DB file path (match your working seed file)
const sqlite = new Database(
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/fc50b649db51ed0c303ff2c4b7c0eca2da269cc3dfc7ce40615fc37a7b53366c.sqlite"
);

// Create Drizzle instance
const db = drizzle(sqlite, { schema });

async function seedBooking() {
  const tableId = 10; // change if needed
  const minutes = 120;

  const now = new Date();
  const from = new Date(now.getTime() - 30 * 60_000); // 30 mins ago
  const until = new Date(now.getTime() + (minutes - 30) * 60_000); // ends later

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
