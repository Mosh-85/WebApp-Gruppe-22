import { db } from "../../db/index";
import { tables } from "../../db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    // --- Read raw JSON (same style as create/delete)
    let rawText = "";
    try {
      rawText = await req.text();
    } catch {}

    let body: any;
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Bad JSON",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const id = Number(body.id);
    const seats = Number(body.seats);

    // Validate ID
    if (!id || Number.isNaN(id) || id <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Ugyldig ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate seats
    if (Number.isNaN(seats) || seats < 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Ugyldig antall plasser",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update table
    await db
      .update(tables)
      .set({ seats })
      .where(eq(tables.id, id))
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        updatedId: id,
        newSeats: seats,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("/api/tables/update error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to update table",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
