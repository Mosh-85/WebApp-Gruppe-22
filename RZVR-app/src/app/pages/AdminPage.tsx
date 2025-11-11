"use client";

// import NotesPage from "./Notes";
import Login from "../components/Admin/Login";
import Nav from "../components/Admin/Nav";
import useAdminSession from "../components/hooks/useAdminSession";
import AdminMenu from "../components/Admin/AdminMenu";

export default function AdminPage() {
  const { payload, loading, refresh, logout } = useAdminSession();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  if (!payload) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">Velkommen — vennligst logg inn</h1>
          <Login onSuccess={() => refresh()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />
      <AdminMenu />
    </div>
  );
}
