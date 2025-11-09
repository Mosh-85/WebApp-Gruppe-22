import { defineApp } from "rwsdk/worker";
import { render, route } from "rwsdk/router";
import { Document } from "./Document";
import { User, users } from "./db/schema/user-schema";
import { setCommonHeaders } from "./headers";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import VippsSims from "./VippsSims";
import ReactEmail from "./ReactEmail";
import Home from "./Home";
import AdminLandingPage from "./AdminLandingPage";

export interface Env {
  DB: D1Database;
}

export type AppContext = {
  user: User | undefined;
  authUrl: string;
};

export default defineApp([
  setCommonHeaders(),
  render(Document, [
    route("/", async () => {
      const userResult = await drizzle(env.DB).select().from(users);
      return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
          <h1>Start</h1>
          <p>Velkommen til eksempel</p>
          <p>Databasen har {userResult.length} brukere</p>
          <div style={{ margin: "1.5rem 0" }}>
            <a
              href="/home"
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "#0070f3",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500",
              }}
            >
              Go to Home Page
            </a>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#666" }}>
            Note: The home page is protected and requires authentication. You
            will be redirected to login if you're not signed in.
          </p>
        </div>
      );
    }),
    route("/home", async (info) => {
      const ctx = info.ctx as AppContext & typeof info.ctx;

      ctx.user ??= { id: 1, name: "username", email: ""};

        if (!ctx.user) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/" },
          });
        }

        return <Home ctx={ctx} />;
      }),
      route ("/vipps", async ({ ctx }) => {
        return (
          <div>
            <AdminLandingPage />
          </div>
        );
      }),
    ]),
  ]);