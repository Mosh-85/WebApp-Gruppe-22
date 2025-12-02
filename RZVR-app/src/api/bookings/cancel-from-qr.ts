import { db } from "../../db/index";
import * as schema from "../../db/schema";
import { bookings } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    // --- Read raw text body
    let rawText = "";
    try {
      rawText = await req.text();
    } catch (textErr) {
      // just proceed
    }

    // Parse JSON
    let body: any = undefined;
    try {
      body = rawText ? JSON.parse(rawText) : undefined;
    } catch (parseErr) {
      console.error("/api/bookings/cancel-from-qr JSON parse error:", parseErr);
      return new Response(
        JSON.stringify({
          error: "Bad request - invalid JSON",
          details: String(parseErr),
          rawBody: rawText,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate QR field
    if (!body || !body.qr) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing QR data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const parsed = typeof body.qr === "string" ? JSON.parse(body.qr) : body.qr;
    const tableId = Number(parsed.tableId);

    if (!tableId) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid QR data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find most recent booking for that table
    const active = await db.query.bookings.findFirst({
      where: (b, { eq }) => eq(b.table_id, tableId),
      orderBy: (b, { desc }) => [desc(b.id)],
      columns: { id: true, status: true },
    });

    if (!active) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `No booking found for table ${tableId}`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (active.status === "cancelled") {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Booking for table ${tableId} already cancelled`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Cancel booking
    await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, active.id))
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        cancelledId: active.id,
        tableId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("/api/bookings/cancel-from-qr error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Cancel failed", details: String(err?.message) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
