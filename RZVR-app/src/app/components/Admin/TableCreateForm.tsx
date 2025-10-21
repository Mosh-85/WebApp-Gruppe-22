"use client"
import { useState } from "react";
import QRCode from "react-qr-code";

export default function TableCreateForm() {
  const [tableId, setTableId] = useState("");
  const [seats, setSeats] = useState<number | "">("");
  const [duplicate, setDuplicate] = useState<number | "">("");
  //const [qrValue, setQrvalue] = 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ tableId, seats, duplicate });

    // qr code data from table 
    const qrDataFromNewTable = {
      tableId: tableId.trim(),
      seats: seats || 0,

    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Opprett nytt bord
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bord ID
            </label>
            <input type="text" value={tableId} onChange={(e) => setTableId(e.target.value)} placeholder="004" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder-gray-400"/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Antall plasser
            </label>
            <input type="number" min={0} value={seats} onChange={(e) => setSeats(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder-gray-400"/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dupliser opprettelse
            </label>
            <input type="number" min={0} value={duplicate} onChange={(e) => setDuplicate(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0 = 1, antall = 1++" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder-gray-400"/>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md">
            Opprett
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <button className="px-6 py-2.5 rounded-xl border border-gray-800 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200 shadow">
          Modifiser Bord
        </button>
      </div>
    </div>
  );
}
