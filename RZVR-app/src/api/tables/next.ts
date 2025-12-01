import { db } from "../../db/index";
import { tables } from "../../db/schema";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(null, { status: 405 });
  }

  try {
    const rows = await db.select().from(tables).all();
    const ids = rows.map((r) => r.id).sort((a, b) => a - b);

    let next = 1;
    for (const id of ids) {
      if (id !== next) break;
      next++;
    }

    return new Response(
      JSON.stringify({ nextId: next, existing: ids }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("/api/tables/next error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to get next table ID" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
