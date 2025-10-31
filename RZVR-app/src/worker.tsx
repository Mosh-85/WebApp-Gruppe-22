import { defineApp } from "rwsdk/worker";
import { render, route } from "rwsdk/router";
import { Document } from "./app/Document";
import { setCommonHeaders } from "./app/headers";
import Home from "./app/pages/Home";
import AdminPage from "./app/pages/AdminPage";
import BookingInfo from "./app/pages/BookingInfo";
import AdminLogin from "./api/admin/login";
import AdminMe from "./api/admin/me";
import AdminLogout from "./api/admin/logout";
import Settings from "./app/pages/admin/Settings";
import StaffSettings from "./app/pages/admin/StaffSettings";
import AdminUsersApi from "./api/admin/users";
import StaffApi from "./api/staff";


export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }: any) => {
    // setup ctx here
    ctx;
  },

  route("/api/admin/login", (reqInfo: any) => AdminLogin(reqInfo.request)),
  route("/api/admin/me", (reqInfo: any) => AdminMe(reqInfo.request)),
  route("/api/admin/logout", (reqInfo: any) => AdminLogout(reqInfo.request)),
  route("/api/admin/users", (reqInfo: any) => AdminUsersApi(reqInfo.request)),
  route("/api/staff", (reqInfo: any) => StaffApi(reqInfo.request)),

  render(Document, [
    route("/", Home),
    route("/admin", AdminPage),
    route("/booking-info", BookingInfo),
    route("/admin/settings", Settings),
    route("/admin/staff-settings", StaffSettings),
  ]),
]);
