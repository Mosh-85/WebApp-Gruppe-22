import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../../db/schema";
import { staff } from "../../db/schema";
import { hashPassword } from "../../server/password";

// 👇 make sure this path matches your actual local D1 database:
const sqlite = new Database(".wrangler/state/v3/d1/miniflare-D1DatabaseObject/fc50b649db51ed0c303ff2c4b7c0eca2da269cc3dfc7ce40615fc37a7b53366c.sqlite");


const db = drizzle(sqlite, { schema });

async function seed() {
  const hashed = await hashPassword("password");

  await db.insert(staff).values({
    first_name: "Admin",
    last_name: "User",
    email: "admin@example.com",
    password: hashed,
    role: 1, // admin role
    created_at: new Date().toISOString(),
  });

  console.log("✅ Admin user seeded: admin@example.com / password");
}

seed();
