"use client";

import { useState } from "react";
import StaffForm from "../../components/Admin/StaffForm";
import ListStaff from "../../components/Admin/ListStaff";
import StaffActions from "../../components/Admin/StaffActions";
import Nav from "../../components/Admin/Nav";
import useAdminSession from "../../components/hooks/useAdminSession";

export default function StaffSettings() {
  const { payload, loading, logout } = useAdminSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!payload) {
    window.location.href = "/admin";
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  const handleStaffCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />
      
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 m-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ansatte innstillinger</h2>
      <a
        href="/admin/settings"
        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 pa-2 mb-4 inline-block text-center"
      >
        Tilbake til Innstillinger
      </a>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Staff Form - Only show for admins */}
        {payload?.isAdmin && (
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Legg til ny ansatt</h3>
            <StaffForm onStaffCreated={handleStaffCreated} />
          </div>
        )}

        {/* Staff List */}
        <div className={payload?.isAdmin ? "" : "w-full"}>
          <ListStaff
            refreshTrigger={refreshTrigger}
            showActions={payload?.isAdmin}
            renderActions={(staff, refreshList) => (
              <StaffActions staff={staff} refreshList={refreshList} />
            )}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
