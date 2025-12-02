import { createSessionHeader } from "../../server/session";
import type { AdminSessionPayload } from "../../../types";
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as schema from "../../db/schema";
import { staff } from "../../db/schema";
import { verifyPassword, hashPassword } from "../../server/password";
import { eq } from "drizzle-orm";

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }
  try {
    let rawText = "";
    try {
      rawText = await req.text();
    } catch (textErr) {
      // Not a fatal error; continue to parsing which will handle empty body
    }

    // Attempt to parse JSON from rawText
    let body: any = undefined;
    try {
      body = rawText ? JSON.parse(rawText) : undefined;
    } catch (parseErr) {
      console.error("/api/admin/login JSON parse error:", parseErr);
      // Return helpful info in dev mode
      if (process.env.NODE_ENV !== "production") {
        return new Response(
          JSON.stringify({
            error: "Bad request - invalid JSON",
            details: String(parseErr),
            rawBody: rawText,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }



    const db = drizzle(env.DB, { schema });


    const { username, password } = body as any;
    // Look up staff by email
    let user = await db.select().from(staff).where(eq(staff.email, username)).get();

    if (!user) {
      // No user found; return invalid credentials rather than creating one.
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!user)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

    if (typeof password !== "string" || typeof username !== "string") {
      return new Response(
        JSON.stringify({ error: "Bad request", message: "username and password must be strings" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ok = verifyPassword(password, user.password as string);
    if (!ok)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

    const tokenPayload: AdminSessionPayload = {
      user: user.email,
      isAdmin: Boolean((user as any).role),
    };
    const res = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    res.headers.append("Set-Cookie", createSessionHeader(tokenPayload, 60 * 60 * 6));
    return res;
  } catch (e: any) {
    console.error("/api/admin/login error:", e);
    if (process.env.NODE_ENV !== "production") {
      return new Response(
        JSON.stringify({ error: "Bad request", message: String(e?.message), stack: e?.stack }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
