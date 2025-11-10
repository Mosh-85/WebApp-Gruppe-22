// src/db/seed.ts

import { defineScript } from "rwsdk/worker";
import { drizzle } from "drizzle-orm/d1";
import { tables } from "./schema/table-schema";
import { users } from "./schema/user-schema";

export default defineScript(async ({ env }) => {
  try {
    const db = drizzle(env.DB);
    await db.delete(users);
    await db.delete(tables);

    // Insert a user
    await db.insert(users).values({
      name: "Test user",
      email: "test@testuser.io",
    });

    await db.insert(tables).values([
      { seats: 4, status: "active" },
      { seats: 0, status: "active"},
    ])

    // Verify the insert by selecting all users
    const result = await db.select().from(tables).all();
    console.log("🌱 Finished seeding:", result);
    return Response.json(result);
  } catch (error) {
    console.error("Error seeding database:", error);
    return Response.json({
      success: false,
      error: "Failed to seed database",
    });
  }
});
