import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import QrPreview from "../Admin/QrPreview";

export default function TableCreateForm() {
  const [tableId, setTableId] = useState("");
  const [seats, setSeats] = useState<number | "">("");
  const [duplicate, setDuplicate] = useState<number | "">("");
  //const [qrValue, setQrValue] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string[]>([]);
  const [showQR, setShowQR] = useState(false);
    

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const res = await fetch("/api/tables/next");
        const data = await res.json();
        setTableId(data.nextId); // e.g. "2"
      } catch (err) {
        console.error("Failed to load next table ID:", err);
      }
    };
    fetchNextId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!tableId) {
    setShowQR(false);
    return;
  }

  const count = duplicate && duplicate > 0 ? duplicate : 1;
  const qrList: string[] = [];

  try {
    // Run the save + QR generation logic 'count' times
    for (let i = 0; i < count; i++) {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId, seats, duplicate: 1 }), // create 1 per loop
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const qrData = JSON.stringify({
          tableId: data.tableId,
          seats: seats || 0,
        });
        qrList.push(qrData);
      }
    }

    // ✅ update state
    setQrValue(qrList);
    setShowQR(true);

    // ✅ refresh next available ID
    const next = await fetch("/api/tables/next").then((r) => r.json());
    setTableId(next.nextId);

  } catch (error) {
    console.error("Error saving to DB:", error);
  }
};


  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Opprett nytt bord
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bord ID
            </label>
            <input type="text" value={tableId} onChange={(e) => setTableId(e.target.value)} placeholder="Loading..." readOnly className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder-gray-400"/>
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


      {showQR && qrValue.length > 0 && (
        <>
          {/* When only 1 QR → center it */}
          {qrValue.length === 1 ? (
            <div className="mt-10 flex justify-center">
              <QrPreview
                value={qrValue[0]}
                label={`Bord ${JSON.parse(qrValue[0]).tableId}`}
                filename={`QR_${JSON.parse(qrValue[0]).tableId}`}
                showDownload={true}
                size={200}
              />
            </div>
          ) : (
            // Otherwise show grid
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {qrValue.map((qr, index) => (
                <div key={index} className="flex flex-col items-center">
                  <QrPreview
                    value={qr}
                    label={`Bord ${JSON.parse(qr).tableId}`}
                    filename={`QR_${JSON.parse(qr).tableId}`}
                    showDownload={true}
                    size={200}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
