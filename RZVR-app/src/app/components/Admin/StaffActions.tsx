"use client";

import { useState } from "react";
import { Staff } from "../../../../types";
import useAdminSession from "../hooks/useAdminSession";

interface StaffActionsProps {
  staff: Omit<Staff, "password">;
  refreshList: () => void; 
}

export default function StaffActions({ staff, refreshList }: StaffActionsProps) {
  const { payload } = useAdminSession();
  const [error, setError] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<Omit<Staff, "password"> | null>(null);
  const [passwordChangeId, setPasswordChangeId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [editFormData, setEditFormData] = useState<Partial<Omit<Staff, "password">>>({});

  if (!payload?.isAdmin) {
    return null;
  }

  const handleEdit = () => {
    setEditingStaff(staff);
    setEditFormData({
      id: staff.id,
      first_name: staff.first_name,
      last_name: staff.last_name,
      email: staff.email,
      role: staff.role,
    });
  };

  const handleChangePassword = () => {
    setPasswordChangeId(staff.id);
    setNewPassword("");
  };

  const handleDelete = async () => {
    if (payload?.user === staff.email) {
      setError("Do not delete yourself.");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${staff.first_name} ${staff.last_name}?`)) return;

    try {
      const response = await fetch(`/api/staff?id=${staff.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete staff: ${response.status}`);
      }

      refreshList(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete staff member");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingStaff || !editFormData.id) return;

    try {
      const response = await fetch("/api/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editFormData.id,
          first_name: editFormData.first_name,
          last_name: editFormData.last_name,
          email: editFormData.email,
          role: editFormData.role,
          action: "update",
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as any;
        throw new Error(errorData.error || "Failed to update staff");
      }

      setEditingStaff(null);
      refreshList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mislyktes å oppdatere ansatt");
    }
  };

  const handleSavePassword = async () => {
    if (!passwordChangeId || !newPassword.trim()) return;

    try {
      const response = await fetch("/api/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: passwordChangeId,
          password: newPassword,
          action: "change-password",
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as any;
        throw new Error(errorData.error || "Mislyktes å endre passord");
      }

      setPasswordChangeId(null);
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mislyktes å endre passord");
    }
  };

  return (
    <>
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-x-2">
        <button onClick={handleEdit} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Oppdatere
        </button>
        <button onClick={handleChangePassword} className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 focus:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Passord
        </button>
        <button 
          onClick={handleDelete} 
          disabled={payload?.user === staff.email}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title={payload?.user === staff.email ? "You cannot delete your own account" : "Delete staff member"}
        >
          Slett
        </button>
      </div>

      {/* Edit Staff */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rediger ansatt</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fornavn</label>
                <input
                  type="text"
                  value={editFormData.first_name || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etternavn</label>
                <input
                  type="text"
                  value={editFormData.last_name || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
                <input
                  type="email"
                  value={editFormData.email || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                <select
                  value={editFormData.role ? "admin" : "waiter"}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, role: e.target.value === "admin" })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="waiter">Servitør</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingStaff(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Lagre Endringer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password */}
      {passwordChangeId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Endre Passord</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nytt Passord</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Skriv inn nytt passord"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setPasswordChangeId(null);
                  setNewPassword("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Avbryt
              </button>
              <button
                onClick={handleSavePassword}
                disabled={!newPassword.trim()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Endre Passord
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
