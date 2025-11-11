"use client";

import { useState, useEffect } from "react";
import { Staff } from "../../../../types";

interface ListStaffProps {
  refreshTrigger?: number; 
  showActions?: boolean; 
  renderActions?: (staff: Omit<Staff, "password">, refreshList: () => void) => React.ReactNode;
}

export default function ListStaff({
  refreshTrigger,
  showActions = false,
  renderActions,
}: ListStaffProps) {
  const [staffList, setStaffList] = useState<Omit<Staff, "password">[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff list
  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/staff");
      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${response.status}`);
      }
      const data = (await response.json()) as Omit<Staff, "password">[];
      setStaffList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [refreshTrigger]);

  return (
    <div>
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Ansatte</h2>
        <button
          onClick={fetchStaff}
          disabled={loading}
          className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Staff List */}
      {loading && !staffList.length ? (
        <div className="text-center py-4 text-gray-500">Laster ansatte...</div>
      ) : staffList.length === 0 ? (
        <div className="text-center py-4 text-gray-500">Ingen ansatte funnet</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {staff.first_name} {staff.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        staff.role ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {staff.role ? "Admin" : "Waiter"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.created_at ? new Date(staff.created_at).toLocaleDateString() : "N/A"}
                  </td>
                  {showActions && renderActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {renderActions(staff, fetchStaff)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
