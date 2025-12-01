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
import QrCancelScanner from "./app/pages/admin/QrCancelScanner";
import CancelFromQrApi from "./api/bookings/cancel-from-qr";
import OpprettBord from "./app/pages/admin/OpprettBord";
import NextTableIdApi from "./api/tables/next";
import CreateTableApi from "./api/tables/create";
import ModifiserBord from "./app/pages/admin/ModifiserBord";
import ListApi from "./api/tables/list";
import DeleteTableApi from "./api/tables/delete";
import UpdateTableApi from "./api/tables/update";
import AdminCalenderPage from "./app/pages/admin/AdminCalenderPage";
 import BookingsApi from "./api/bookings";

// file location for QR ###################


export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }: any) => {
    // setup ctx here
    ctx;
  },
  // trenger dette ellers så vil den ikke redirekte etter login 
  route("/api/admin/login", (reqInfo: any) => AdminLogin(reqInfo.request)),
  route("/api/admin/me", (reqInfo: any) => AdminMe(reqInfo.request)),
  route("/api/admin/logout", (reqInfo: any) => AdminLogout(reqInfo.request)),
  route("/api/admin/users", (reqInfo: any) => AdminUsersApi(reqInfo.request)),
  route("/api/staff", (reqInfo: any) => StaffApi(reqInfo.request)),
  route("/api/bookings", (reqInfo: any) => BookingsApi(reqInfo.request)),
  route("/api/bookings/cancel-from-qr", (reqInfo: any) => CancelFromQrApi(reqInfo.request)),
  route("/api/tables/next", (reqInfo: any) => NextTableIdApi(reqInfo.request)),
  route("/api/tables", (reqInfo: any) => CreateTableApi(reqInfo.request)),
  route("/api/tables/list", (reqInfo: any) => ListApi(reqInfo.request)),
  route("/api/tables/delete", (reqInfo) => DeleteTableApi(reqInfo.request)),
  route("/api/tables/update", (reqInfo) => UpdateTableApi(reqInfo.request)),




  render(Document, [
    route("/", Home),
    route("/admin", AdminPage),
    route("/booking-info", BookingInfo),
    route("/admin/settings", Settings),
    route("/admin/staff-settings", StaffSettings),
    route("/admin/QrCancelScanner", QrCancelScanner), 
    route("/admin/OpprettBord", OpprettBord), 
    route("/admin/ModifiserBord", ModifiserBord), 
    route("/admin/kalender", AdminCalenderPage),
  ]),
]);
//####################### må være lik AdminMenu.tsx og vises i URL bar