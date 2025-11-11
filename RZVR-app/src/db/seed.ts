// src/db/seed.ts

import { defineScript } from "rwsdk/worker";
import { drizzle } from "drizzle-orm/d1";
import { staff } from "./schema";
import { hashPassword } from "../server/password";

export default defineScript(async ({ env }) => {
  try {
    const db = drizzle(env.DB);

    // Clear existing staff data
    await db.delete(staff);

    // Create an admin user
    await db.insert(staff).values({
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: hashPassword("password"),
      role: 1,
      created_at: new Date().toISOString(),
    });

    console.debug("🌱 Finished seeding staff table");
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error seeding database:", error);
    return Response.json({ success: false, error: "Failed to seed database" });
  }
});
