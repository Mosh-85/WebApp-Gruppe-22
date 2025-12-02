"use client";

import Nav from "../../components/Admin/Nav";
import useAdminSession from "../../components/hooks/useAdminSession";
import ReservationCalendar from "../../components/ReservationCalender"; // adjust path if needed

const menuItems = [
  { href: "/admin", label: "Tilbake", color: "gray" },
];

const getButtonClasses = (color: string) => {
  const baseClasses =
    "block w-full text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 text-center";
  const colorClasses = {
    gray: "bg-gray-500 hover:bg-gray-600",
    blue: "bg-blue-500 hover:bg-blue-600",
  };
  return `${baseClasses} ${
    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
  }`;
};

export default function AdminCalenderPage() {
  const { payload, loading, logout } = useAdminSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!payload) {
    window.location.href = "/admin";
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />

      <nav className="py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Admin – Reservasjonskalender
        </h1>

        <ul className="max-w-2xl mx-auto mb-8 space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={getButtonClasses(item.color)}
                onClick={(event) => {
                  event?.preventDefault();
                  window.location.href = item.href;
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* 👇 Her vises kalenderen */}
        <div className="max-w-6xl mx-auto">
          <ReservationCalendar />
        </div>
      </nav>
    </div>
  );
}
