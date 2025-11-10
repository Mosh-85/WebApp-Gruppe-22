import { defineScript } from "rwsdk/worker";
import { drizzle } from "drizzle-orm/d1";
import { tables } from "../lib/db/schema/table-schema";
import { eq } from "drizzle-orm";

type Env = { DB: D1Database };

export default defineScript(async (ctx: any) => {
  try {
    const db = drizzle(ctx.env.DB);

    let body: any = null;

    if (ctx.request && typeof ctx.request.json === "function") {
      try {
        body = await ctx.request.json();
      } catch {
        body = null;
      }
    } else if (ctx.data) {
      body = ctx.data;
    } else if (ctx.body) {
      body = ctx.body;
    }

    const id = body?.id;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Problem med ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const parsedId = Number(id);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Feil med ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await db.delete(tables).where(eq(tables.id, parsedId));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Slettefeil:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Klarer ikke slette bord" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});