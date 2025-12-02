import { db } from "../../db/index";
import { qrcodes, tables } from "../../db/schema";
import { eq } from "drizzle-orm";

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

    const id = Number(body.id);

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

    // Perform delete
    await db.delete(qrcodes).where(eq(qrcodes.table_id, id)).run();

    await db.delete(tables).where(eq(tables.id, id)).run();


    return new Response(
      JSON.stringify({
        success: true,
        deletedId: id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("/api/tables/delete error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to delete table" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
