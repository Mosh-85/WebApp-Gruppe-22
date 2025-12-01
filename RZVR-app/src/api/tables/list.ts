import { db } from "../../db/index";
import { tables } from "../../db/schema";

export default async function ListTablesApi(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(null, { status: 405 });
  }

  try {
    const rows = await db.select().from(tables).all();

    return new Response(
      JSON.stringify({ success: true, tables: rows }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("/api/tables/list error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to list tables" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
