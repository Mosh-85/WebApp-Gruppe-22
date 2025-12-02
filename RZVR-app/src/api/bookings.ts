// src/api/bookings.ts
import { db } from "../db";
import { bookings, tables } from "../db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

type CreateBookingPayload = {
  fullName: string;
  people: string | number;
  email: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  mobile?: string;
};

type UpdateBookingPayload = {
  id: number;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  status?: string;
  tableId?: number;
  fromDateTime?: string;
  untilDateTime?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function BookingsApi(req: Request) {
  try {
    const url = new URL(req.url);

    // GET /api/bookings?date=YYYY-MM-DD (for admin-kalenderen)
    if (req.method === "GET") {
      const dateParam =
        url.searchParams.get("date") ??
        url.searchParams.get("dato") ??
        url.searchParams.get("day");

      if (!dateParam) {
        return jsonResponse({ error: "Missing date" }, 400);
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        return jsonResponse({ error: "Invalid date format, expected YYYY-MM-DD" }, 400);
      }

      const start = new Date(`${dateParam}T00:00:00.000Z`);
      if (Number.isNaN(start.getTime())) {
        return jsonResponse({ error: "Invalid date" }, 400);
      }
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

      const startIso = start.toISOString();
      const endIso = end.toISOString();

      const rows = await db
        .select()
        .from(bookings)
        .where(
          and(
            gte(bookings.from_date_time, startIso),
            lt(bookings.from_date_time, endIso),
          ),
        )
        .all();

      // Kalenderen forventer liste av booking-rows direkte
      return jsonResponse(rows, 200);
    }

    // POST /api/bookings (kunde lager booking)
    if (req.method === "POST") {
      const raw = await req.text().catch(() => "");
      let body: CreateBookingPayload;
      try {
        body = raw ? (JSON.parse(raw) as CreateBookingPayload) : ({} as any);
      } catch {
        return jsonResponse({ error: "Bad JSON" }, 400);
      }

      const { fullName, people, email, date, time, mobile } = body;

      if (!fullName || !email || !date || !time || !people) {
        return jsonResponse(
          { error: "fullName, email, date, time og people er påkrevd" },
          400,
        );
      }

      const numPeople = Number(people);
      if (!Number.isFinite(numPeople) || numPeople <= 0) {
        return jsonResponse({ error: "people må være et positivt tall" }, 400);
      }

      const nameParts = String(fullName).trim().split(/\s+/);
      const customer_first_name = nameParts[0] ?? null;
      const customer_last_name =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

      const from = new Date(`${date}T${time}:00.000Z`);
      if (Number.isNaN(from.getTime())) {
        return jsonResponse({ error: "Ugyldig dato/tid" }, 400);
      }
      const until = new Date(from.getTime() + 2 * 60 * 60 * 1000); // 2 timer

      // Finn et egnet bord (eller fallback til første 1)
      let tableId = 1;
      try {
        const allTables = await db.select().from(tables).all();
        if (allTables.length > 0) {
          const suitable = allTables.filter(
            (t) => t.seats == null || (t.seats ?? 0) >= numPeople,
          );
          const chosen =
            suitable.sort(
              (a, b) => (a.seats ?? 9999) - (b.seats ?? 9999),
            )[0] ?? allTables[0];
          tableId = chosen.id!;
        }
      } catch (err) {
        console.warn("Kunne ikke finne bord, bruker table_id=1", err);
        tableId = 1;
      }

      await db.insert(bookings).values({
        table_id: tableId,
        available_time_id: null,
        customer_first_name,
        customer_last_name,
        customer_email: String(email),
        from_date_time: from.toISOString(),
        until_date_time: until.toISOString(),
        status: "active", // 👈 viktig: kalenderen ser ofte etter 'active'
        vipps_transaction_id: mobile ? String(mobile) : null,
        created_at: new Date().toISOString(),
      });

      return jsonResponse({ success: true }, 201);
    }

    // PUT /api/bookings (admin oppdaterer booking i kalenderen) 
    if (req.method === "PUT") {
      const raw = await req.text().catch(() => "");
      let body: UpdateBookingPayload;
      try {
        body = raw ? (JSON.parse(raw) as UpdateBookingPayload) : ({} as any);
      } catch {
        return jsonResponse({ error: "Bad JSON" }, 400);
      }

      if (!body.id) {
        return jsonResponse({ error: "id er påkrevd" }, 400);
      }

      const updates: any = {};

      if (typeof body.customerFirstName === "string") {
        updates.customer_first_name = body.customerFirstName || null;
      }
      if (typeof body.customerLastName === "string") {
        updates.customer_last_name = body.customerLastName || null;
      }
      if (typeof body.customerEmail === "string") {
        updates.customer_email = body.customerEmail || null;
      }
      if (typeof body.status === "string") {
        updates.status = body.status;
      }
      if (typeof body.tableId === "number") {
        updates.table_id = body.tableId;
      }
      if (typeof body.fromDateTime === "string") {
        updates.from_date_time = body.fromDateTime;
      }
      if (typeof body.untilDateTime === "string") {
        updates.until_date_time = body.untilDateTime;
      }

      if (Object.keys(updates).length === 0) {
        return jsonResponse({ error: "Ingen felter å oppdatere" }, 400);
      }

      await db
        .update(bookings)
        .set(updates)
        .where(eq(bookings.id, Number(body.id)))
        .run();

      return jsonResponse({ success: true }, 200);
    }

    // Andre metoder ikke tillatt
    return new Response(null, { status: 405 });
  } catch (err: any) {
    console.error("/api/bookings error:", err);
    return jsonResponse(
      {
        error: "Server error",
        message: String(err?.message ?? err),
      },
      500,
    );
  }
}
