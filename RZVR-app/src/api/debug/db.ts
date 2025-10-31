import { env } from "cloudflare:workers";

export default async function handler(req: Request) {
  try {
    const db = (env as any).DB;
    if (!db) {
      return new Response(JSON.stringify({ ok: false, message: "env.DB is not bound" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try a simple query to list tables
    try {
      const res = await (db as any)
        .prepare("SELECT name FROM sqlite_master WHERE type='table'")
        .all();
      // D1 returns an object with results; normalize if needed
      const rows = res?.results || res?.rows || res;
      return new Response(JSON.stringify({ ok: true, tables: rows }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (qerr) {
      return new Response(
        JSON.stringify({ ok: false, message: "Query failed", error: String(qerr) }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
