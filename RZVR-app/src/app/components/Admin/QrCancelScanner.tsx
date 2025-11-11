import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";


export default function QrCancelScanner() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Correct handler for @yudiel/react-qr-scanner
  const onScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes?.length) return; // nothing detected yet

    const text = detectedCodes[0]?.rawValue; // get actual QR text
    if (!text) return;

    setResult(`Scanned: ${text}`);

    try {
      const res = await fetch("/api/bookings/cancel-from-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr: text }),
      });

      const data = (await res.json()) as { success: boolean; cancelledId?: string; message?: string };

      

      if (data.success) {
        setResult(`✅ Cancelled booking #${data.cancelledId}`);
      } else {
        setResult(data.message || "⚠️ No matching booking found");
      }
    } catch (err) {
      console.error(err);
      setResult("❌ Error cancelling booking");
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-5 py-2 rounded-xl bg-gray-900 text-white"
      >
        {open ? "Close scanner" : "Scan QR to cancel"}
      </button>

      {open && (
        <div className="rounded-xl overflow-hidden shadow-lg">
          <Scanner
            onScan={onScan}
            onError={(e) => console.error(e)}
            components={{ finder: true }}
            constraints={{ facingMode: "environment" }}
            styles={{ container: { width: 320, height: 240 } }}
          />
        </div>
      )}

      {result && <p className="text-sm text-gray-300">{result}</p>}
    </div>
  );
}
