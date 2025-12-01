"use client";

import { useEffect, useState } from "react";


type Table = {
  id: number;
  seats: number;
  status: string;
};

export default function ModifiserBord() {
  const [tables, setTables] = useState<Table[]>([]);
  const [disabledIds, setDisabledIds] = useState<number[]>([]);

const fetchTables = async () => {
  try {
    const res = await fetch("/api/tables/list");
    const json = await res.json();

    if (json.success) {
      setTables(json.tables);
    }
  } catch (err) {
    console.error("Failed to fetch tables:", err);
  }
};

  useEffect(() => {
    fetchTables();
  }, []);

const handleUpdate = async (id: number, current: number) => {
  const newSeats = prompt("Nytt antall plasser:", current.toString());
  if (newSeats === null) return;

  const seats = Number(newSeats);

  const res = await fetch("/api/tables/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, seats }),
  });

  const json = await res.json();

  if (json.success) {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, seats } : t
      )
    );
  } else {
    console.error("Update failed:", json.error);
  }
};


const handleDelete = async (id: number) => {
  try {
    const res = await fetch("/api/tables/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const json = await res.json();

    if (json.success) {
      // Update UI
      setTables((prev) => prev.filter((t) => t.id !== id));
      setDisabledIds((prev) => [...prev, id]);
    } else {
      console.error("Delete failed:", json.error);
    }
  } catch (err) {
    console.error("Error calling delete API:", err);
  }
};


  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[600px]">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-300 text-gray-800">
              <th className="border p-2">Bord ID</th>
              <th className="border p-2">Antall plasser</th>
              <th className="border p-2">Endre</th>
              <th className="border p-2">Slett</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((t) => (
              <tr key={t.id} className="odd:bg-gray-100 even:bg-white">
                <td className="border p-2">
                  {String(t.id).padStart(3, "0")}
                </td>
                <td className="border p-2">{t.seats}</td>
                <td className="border p-2">
                  <button
                    disabled={disabledIds.includes(t.id)}
                    onClick={() => handleUpdate(t.id, t.seats)}
                    className={`px-3 py-1 rounded text-white ${
                        disabledIds.includes(t.id)
                            ? "bg-gray-400"
                            : "bg-gray-700 hover:bg-gray-800"
                    }`}

                  >
                    Endre
                  </button>
                </td>
                <td className="border p-2">
                  <button
                    disabled={disabledIds.includes(t.id)}
                    onClick={() => handleDelete(t.id)}
                    className={`px-3 py-1 rounded text-white ${
                        disabledIds.includes(t.id)
                            ? "bg-red-300"
                            : "bg-red-600 hover:bg-red-700"
                    }`}

                  >
                    Slett
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}