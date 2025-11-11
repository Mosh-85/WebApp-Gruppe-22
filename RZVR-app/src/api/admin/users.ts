import { getSessionFromRequest } from "../../server/session";
import type { AdminSessionPayload, CreateUserPayload, StaffRow } from "../../../types";
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as schema from "../../db/schema";
import { staff } from "../../db/schema";
import { hashPassword } from "../../server/password";
import { eq } from "drizzle-orm";

export default async function handler(req: Request) {
  try {
    const payload: AdminSessionPayload | null = getSessionFromRequest(req as Request | any);
    if (!payload || !payload.isAdmin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const db = drizzle(env.DB, { schema });

    if (req.method === "GET") {
      const rows = await db.select().from(staff).all();
      const safe = rows.map((r: StaffRow | any) => ({
        id: r.id,
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email,
        role: Number((r as any).role) === 1,
        created_at: r.created_at,
      }));
      return new Response(JSON.stringify(safe), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const raw = await req.text().catch(() => "");
      let body: CreateUserPayload = {} as CreateUserPayload;
      try {
        body = raw ? (JSON.parse(raw) as CreateUserPayload) : ({} as CreateUserPayload);
      } catch (e) {
        return new Response(JSON.stringify({ error: "Bad JSON" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const { first_name, last_name, email, password, isAdmin } = body;
      if (!email || !password)
        return new Response(JSON.stringify({ error: "email and password required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });

      const hashed = hashPassword(String(password));
      const insert = await db
        .insert(staff)
        .values({
          first_name: first_name || null,
          last_name: last_name || null,
          email: String(email),
          password: hashed,
          role: isAdmin ? 1 : 0,
          created_at: new Date().toISOString(),
        });
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (req.method === "PATCH") {
      try {
        const url = new URL((req as any).url || req.url);
        const id = url.searchParams.get("id");
        if (!id)
          return new Response(JSON.stringify({ error: "id required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        const raw = await req.text().catch(() => "");
        let body: any = {};
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch (e) {
          return new Response(JSON.stringify({ error: "Bad JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Password update
        if (body.password) {
          if (typeof body.password !== "string" || body.password.length === 0)
            return new Response(JSON.stringify({ error: "password required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          const hashed = hashPassword(body.password);
          await db
            .update(staff)
            .set({ password: hashed })
            .where(eq(staff.id, Number(id)))
            .run();
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Profile updates
        const updates: any = {};
        if (typeof body.first_name === "string") updates.first_name = body.first_name || null;
        if (typeof body.last_name === "string") updates.last_name = body.last_name || null;
        if (typeof body.email === "string") updates.email = body.email;
        if (typeof body.isAdmin === "boolean") updates.role = body.isAdmin ? 1 : 0;

        if (Object.keys(updates).length === 0) {
          return new Response(JSON.stringify({ error: "nothing to update" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          await db
            .update(staff)
            .set(updates)
            .where(eq(staff.id, Number(id)))
            .run();
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          // Map unique-email constraint errors to 409 Conflict
          const msg = String(err?.message ?? err);
          if (/unique|UNIQUE|constraint failed/i.test(msg)) {
            return new Response(JSON.stringify({ error: "email already exists" }), {
              status: 409,
              headers: { "Content-Type": "application/json" },
            });
          }
          console.error("PATCH /api/admin/users update error", err);
          return new Response(JSON.stringify({ error: "Failed to update profile" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (err: any) {
        console.error("PATCH /api/admin/users error", err);
        return new Response(JSON.stringify({ error: "Failed to update" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (req.method === "PATCH") {
      try {
        const url = new URL((req as any).url || req.url);
        const id = url.searchParams.get("id");
        if (!id)
          return new Response(JSON.stringify({ error: "id required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        const raw = await req.text().catch(() => "");
        let body: any = {};
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch (e) {
          return new Response(JSON.stringify({ error: "Bad JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const { password } = body as { password?: string };
        if (!password || typeof password !== "string")
          return new Response(JSON.stringify({ error: "password required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        const hashed = hashPassword(password);
        await db
          .update(staff)
          .set({ password: hashed })
          .where(eq(staff.id, Number(id)))
          .run();
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        console.error("PATCH /api/admin/users error", err);
        return new Response(JSON.stringify({ error: "Failed to update password" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(null, { status: 405 });
  } catch (e: any) {
    console.error("/api/admin/users error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
