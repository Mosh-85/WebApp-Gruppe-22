"use client";

import Nav from "../../components/Admin/Nav";
import useAdminSession from "../../components/hooks/useAdminSession";

const settingsMenuItems = [
  { href: "/admin", label: "Tillbake", color: "gray" },
  { href: "/admin/OpprettBord", label: "Opprett bord", color: "blue" },
  { href: "/admin/staff-settings", label: "Endre profil", color: "blue" },
];

const getButtonClasses = (color: string) => {
  const baseClasses =
    "block w-full text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 text-center";
  const colorClasses = {
    gray: "bg-gray-500 hover:bg-gray-600",
    blue: "bg-blue-500 hover:bg-blue-600",
  };
  return `${baseClasses} ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`;
};

function route(path: string, handler: any) {
  return { path, handler };
}

export default function Settings() {
  const { payload, loading, logout } = useAdminSession();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Redirect to login if not authenticated (allow both admin and regular staff)
  if (!payload) {
    window.location.href = "/admin";
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />
      
      <nav className="py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Instillinger</h1>
      <ul className="max-w-2xl mx-auto space-y-4">
        {settingsMenuItems.map((item, index) => (
          <li key={index}>
            <button className={getButtonClasses(item.color)} onClick={(event) => { event?.preventDefault(); window.location.href = item.href; }}>{item.label}</button>
          </li>
        ))}
      </ul>
    </nav>
    </div>
  );
}
