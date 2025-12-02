import { db } from "../../db/index";
import { tables, qrcodes } from "../../db/schema";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    // --- Read raw JSON
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

    const seats = Number(body.seats) || 0;

    // Insert table
    const inserted = await db
      .insert(tables)
      .values({ seats, status: "active" })
      .returning({ id: tables.id })
      .get();

    // Build QR payload (same structure React uses)
    const qrData = JSON.stringify({
      tableId: inserted.id,
      seats,
    });

    // Insert QR code — FIX: correct column names
    await db
      .insert(qrcodes)
      .values({
        table_id: inserted.id,
        qr_data: qrData,
      })
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        tableId: inserted.id,
        qrData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("/api/tables/create error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to insert table" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
