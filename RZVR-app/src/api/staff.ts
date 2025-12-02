import { db } from "../db";
import { staff } from "../db/schema";
import { eq } from "drizzle-orm";
import type { Staff } from "../../types";
import { hashPassword } from "../server/password";

export default async function StaffApi(req: Request) {
  try {
    switch (req.method) {
      case "GET": {
        const allStaff = await db.select().from(staff).all();
        // Normalize role to boolean for client, exclude password
        const normalized: Omit<Staff, "password">[] = allStaff.map((person) => ({
          id: person.id,
          first_name: person.first_name,
          last_name: person.last_name,
          email: person.email,
          role: Boolean(person.role),
          created_at: person.created_at,
        }));
        return new Response(JSON.stringify(normalized), {
          headers: { "Content-Type": "application/json" },
        });
      }

      case "POST": {
        const body = (await req.json()) as Omit<Staff, "id" | "created_at"> & {
          first_name?: string | null;
          last_name?: string | null;
        };

        if (!body?.email || !body?.password) {
          return new Response(JSON.stringify({ error: "Email and password are required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const result = await db
            .insert(staff)
            .values({
              first_name: body.first_name || null,
              last_name: body.last_name || null,
              email: body.email,
              password: hashPassword(body.password),
              role: body.role ? 1 : 0,
              created_at: new Date().toISOString(),
            })
            .returning();

          const normalized: Omit<Staff, "password"> = {
            ...result[0],
            role: Boolean(result[0].role),
          };
          delete (normalized as any).password; 

          return new Response(
            JSON.stringify({
              success: true,
              staff: normalized,
            }),
            {
              status: 201,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: any) {
          // Handle unique constraint violation
          if (err.message?.includes("UNIQUE constraint failed")) {
            return new Response(JSON.stringify({ error: "Email already exists" }), {
              status: 409,
              headers: { "Content-Type": "application/json" },
            });
          }
          throw err;
        }
      }

      case "PUT": {
        const body = (await req.json()) as Partial<Staff> & {
          id: number; 
          password?: string; 
          action?: string; 
        };

        if (!body?.id) {
          return new Response(JSON.stringify({ error: "id is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Handle password change separately
        if (body.action === "change-password") {
          if (!body.password) {
            return new Response(
              JSON.stringify({ error: "password is required for password change" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          await db
            .update(staff)
            .set({
              password: hashPassword(body.password),
            })
            .where(eq(staff.id, body.id));

          return new Response(
            JSON.stringify({ success: true, message: "Password updated successfully" }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Handle regular data updates
        const updates: any = {};
        if (body.first_name !== undefined) updates.first_name = body.first_name;
        if (body.last_name !== undefined) updates.last_name = body.last_name;
        if (body.email !== undefined) updates.email = body.email;
        if (body.role !== undefined) updates.role = body.role ? 1 : 0;

        try {
          await db.update(staff).set(updates).where(eq(staff.id, body.id));
          return new Response(
            JSON.stringify({ success: true, message: "Staff updated successfully" }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: any) {
          // Handle unique constraint violation
          if (err.message?.includes("UNIQUE constraint failed")) {
            return new Response(JSON.stringify({ error: "Email already exists" }), {
              status: 409,
              headers: { "Content-Type": "application/json" },
            });
          }
          throw err;
        }
      }

      case "DELETE": {
        const url = new URL(req.url);
        const idParam = url.searchParams.get("id");
        const id = idParam ? Number(idParam) : NaN;

        if (!id) {
          return new Response(JSON.stringify({ error: "id query param required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        await db.delete(staff).where(eq(staff.id, id));

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (err: any) {
    console.error("/api/staff error:", err);
    return new Response(
      JSON.stringify({
        error: "Server error",
        message: String(err?.message),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
