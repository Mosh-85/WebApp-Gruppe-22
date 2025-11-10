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
    const newSeats = body?.newSeats;

    if (id == null || newSeats == null) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Mangler ID eller nytt antall seter",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const parsedId = Number(id);
    const parsedSeats = Number(newSeats);

    if (Number.isNaN(parsedId) || parsedId <= 0 || Number.isNaN(parsedSeats)) {
      return new Response(
        JSON.stringify({ success: false, error: "Feil" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await db
      .update(tables)
      .set({ seats: parsedSeats })
      .where(eq(tables.id, parsedId));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Oppdateringsfeil:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Klarte ikke oppdatere bord" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});