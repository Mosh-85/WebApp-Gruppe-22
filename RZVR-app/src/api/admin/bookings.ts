import { db } from "../../db/index";
import { bookings, tables } from "../../db/schema";
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

// Hjelper: hent dato i YYYY-MM-DD uansett om vi fikk f.eks. "2025-03-10" eller "2025-03-10T12:00:00Z"
function normalizeDateParam(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Ta de 10 første tegnene: "2025-03-10"
  const dateOnly = trimmed.slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    return null;
  }
  return dateOnly;
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);

    // --------------------------------------------------------------------
    // GET /api/admin/bookings?date=YYYY-MM-DD
    // Henter ALLE bookinger for en gitt dag (brukes av admin-kalenderen)
    // --------------------------------------------------------------------
    if (req.method === "GET") {
      const rawDate =
        url.searchParams.get("date") ??
        url.searchParams.get("dato") ??
        url.searchParams.get("day");

      const dateParam = normalizeDateParam(rawDate);

      if (!dateParam) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Mangler eller ugyldig dato. Forventet format: YYYY-MM-DD (f.eks. 2025-03-10)",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const start = new Date(`${dateParam}T00:00:00.000Z`);
      if (Number.isNaN(start.getTime())) {
        return new Response(
          JSON.stringify({ success: false, error: "Ugyldig dato" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      const startIso = start.toISOString();
      const endIso = end.toISOString();

      console.log(
        "[admin bookings] GET",
        "dateParam =",
        dateParam,
        "startIso =",
        startIso,
        "endIso =",
        endIso,
      );

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

      console.log(
        "[admin bookings] Fant",
        rows.length,
        "bookinger for dato",
        dateParam,
      );

      // Viktig: returner ET ARRAY direkte – dette forventer ReservationCalendar
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --------------------------------------------------------------------
    // POST /api/admin/bookings  (kunde lager booking)
    // --------------------------------------------------------------------
    if (req.method === "POST") {
      let body: CreateBookingPayload;
      try {
        body = (await req.json()) as CreateBookingPayload;
      } catch {
        return new Response(
          JSON.stringify({ success: false, error: "Bad JSON" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const { fullName, people, email, date, time, mobile } = body;

      if (!fullName || !email || !date || !time || !people) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "fullName, email, date, time og people er påkrevd",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const numPeople = Number(people);
      if (!Number.isFinite(numPeople) || numPeople <= 0) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "people må være et positivt tall",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const nameParts = String(fullName).trim().split(/\s+/);
      const customer_first_name = nameParts[0] ?? null;
      const customer_last_name =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

      const from = new Date(`${date}T${time}:00.000Z`);
      if (Number.isNaN(from.getTime())) {
        return new Response(
          JSON.stringify({ success: false, error: "Ugyldig dato/tid" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const until = new Date(from.getTime() + 2 * 60 * 60 * 1000); // 2 timer

      // Finn et egnet bord (eller fallback til 1)
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
        console.warn(
          "[admin bookings] Kunne ikke finne bord, bruker table_id=1",
          err,
        );
        tableId = 1;
      }

      await db
        .insert(bookings)
        .values({
          table_id: tableId,
          available_time_id: null,
          customer_first_name,
          customer_last_name,
          customer_email: String(email),
          from_date_time: from.toISOString(),
          until_date_time: until.toISOString(),
          status: "active",
          vipps_transaction_id: mobile ? String(mobile) : null,
          created_at: new Date().toISOString(),
        })
        .run();

      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --------------------------------------------------------------------
    // PUT /api/admin/bookings  (admin oppdaterer booking)
    // --------------------------------------------------------------------
    if (req.method === "PUT") {
      let body: UpdateBookingPayload;
      try {
        body = (await req.json()) as UpdateBookingPayload;
      } catch {
        return new Response(
          JSON.stringify({ success: false, error: "Bad JSON" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (!body.id) {
        return new Response(
          JSON.stringify({ success: false, error: "id er påkrevd" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const updates: Record<string, unknown> = {};

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
        return new Response(
          JSON.stringify({
            success: false,
            error: "Ingen felter å oppdatere",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      await db
        .update(bookings)
        .set(updates)
        .where(eq(bookings.id, Number(body.id)))
        .run();

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --------------------------------------------------------------------
    // Andre metoder ikke tillatt
    // --------------------------------------------------------------------
    return new Response(null, { status: 405 });
  } catch (err) {
    console.error("/api/admin/bookings error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
