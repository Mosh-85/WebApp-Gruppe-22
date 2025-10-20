import { defineApp } from "rwsdk/worker";
import { render, route } from "rwsdk/router";
import { Document } from "./app/Document";
import Home from "./app/pages/Home";
import AdminPage from "./app/pages/AdminPage";
import BookingInfo from "./app/pages/BookingInfo";

import { User, users } from "./db/schema/user-schema";
import { setCommonHeaders } from "./app/headers";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

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
    route("/", Home),
    route("/admin", AdminPage),
    route("/booking-info", BookingInfo),
  ]),
]);
