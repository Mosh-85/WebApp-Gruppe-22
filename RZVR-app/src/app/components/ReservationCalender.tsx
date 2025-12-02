"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./ReservationCalender.css";

// Bordene vi har – matcher table_id 1–7 (tilpass om du har flere)
const tables = ["Bord #001", "Bord #002", "Bord #003", "Bord #004", "Bord #005", "Bord #006", "Bord #007"];

// Timeslottene vi viser
const timeSlots = ["12:00","13:00","14:00" ,"15:00","16:00","17:00","18:00","19:00", "20:00"];

// ---------- Typer ----------
type BookingRow = {
  id: number;
  table_id: number;
  available_time_id: number | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  from_date_time: string;  // ISO
  until_date_time: string; // ISO
  status: string | null;
  vipps_transaction_id: string | null;
  created_at: string | null;
};

type CalendarReservation = {
  table: string;
  time: string;
  bookingId: number;
  customerName: string;
};

function ymd(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatDateNO(date: Date) {
  return date.toLocaleDateString("nb-NO", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function getSlotDateTime(date: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function mapToCalendar(rows: BookingRow[]): CalendarReservation[] {
  const out: CalendarReservation[] = [];
  for (const r of rows) {
    const from = new Date(r.from_date_time);
    const until = new Date(r.until_date_time);

    for (const t of timeSlots) {
      const slotDate = getSlotDateTime(from, t);
      if (slotDate >= from && slotDate < until) {
        const idx = r.table_id - 1;
        out.push({
          table: tables[idx] ?? `Bord #${String(r.table_id).padStart(3, "0")}`,
          time: t,
          bookingId: r.id,
          customerName: `${r.customer_first_name ?? ""} ${r.customer_last_name ?? ""}`.trim() || "Opptatt",
        });
      }
    }
  }
  return out;
}

export default function ReservationCalendar() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // valgt booking for redigering
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Hent bookinger for valgt dato
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setSelected(null);
      setSaveMsg(null);
      try {
        const d = ymd(date);
        const res = await fetch(`/api/admin/bookings?date=${d}`);
        if (!res.ok) throw new Error(`Henting feilet (${res.status})`);
        const data = (await res.json()) as BookingRow[];
        setRows(data);
      } catch (e: any) {
        setError(e?.message ?? "Klarte ikke hente bookinger");
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [date]);

  const calendar = useMemo(() => mapToCalendar(rows), [rows]);

  function findReservation(time: string, table: string) {
    return calendar.find((r) => r.time === time && r.table === table);
  }

  function prevDay() {
    const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d);
  }
  function nextDay() {
    const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d);
  }

  function onCellClick(time: string, table: string) {
    const hit = findReservation(time, table);
    if (!hit) return; // admin kan kun redigere eksisterende
    const full = rows.find((r) => r.id === hit.bookingId) || null;
    setSelected(full);
    setSaveMsg(null);
  }

  async function saveChanges(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      // send bare felter som kan endres
      const payload: any = {
        id: selected.id,
        customerFirstName: selected.customer_first_name ?? "",
        customerLastName: selected.customer_last_name ?? "",
        customerEmail: selected.customer_email ?? "",
        status: selected.status ?? "",
        tableId: selected.table_id,
        fromDateTime: selected.from_date_time,
        untilDateTime: selected.until_date_time,
      };

      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Lagring feilet (${res.status})`);
      setSaveMsg("Lagret ✅");

      // refresh dagens data
      const refreshed = await fetch(`/api/admin/bookings?date=${ymd(date)}`);
      setRows((await refreshed.json()) as BookingRow[]);
      // oppdater valgt booking-objekt med respons om du vil
    } catch (e: any) {
      setSaveMsg(e?.message ?? "Kunne ikke lagre endringer");
    } finally {
      setSaving(false);
    }
  }

  // enkel hjelp til å endre start/slutt via dropdown
  function updateTime(field: "from_date_time" | "until_date_time", newTime: string) {
    if (!selected) return;
    const base = new Date(selected.from_date_time);
    const [h, m] = newTime.split(":").map(Number);
    const d = new Date(base);
    d.setHours(h, m ?? 0, 0, 0);
    setSelected({ ...selected, [field]: d.toISOString() } as BookingRow);
  }

  return (
    <div className="calendar-page">
      <div className="top-bar">
        <button type="button" className="nav-button" onClick={prevDay}>← Forrige dag</button>
        <div className="date-display">{formatDateNO(date)}</div>
        <button type="button" className="nav-button" onClick={nextDay}>Neste dag →</button>
      </div>

      <div className="calendar-card">
        <div className="calendar-header">
          <h2>Reservasjoner (admin)</h2>
          <span className="calendar-subtitle">Klikk på en <b>opptatt</b> rute for å se og redigere booking-detaljer.</span>
        </div>

        {loading && <div className="info-banner">Laster reservasjoner…</div>}
        {error && <div className="error-banner">{error}</div>}

        <div className="calendar-grid">
          {/* header-rad */}
          <div className="header-row">
            <div className="header-cell header-cell-time">Tid</div>
            {tables.map((t) => <div key={t} className="header-cell">{t}</div>)}
          </div>

          {/* rader */}
          {timeSlots.map((t) => (
            <div key={t} className="time-row">
              <div className="cell cell-time">{t}</div>
              {tables.map((tb) => {
                const r = findReservation(t, tb);
                const isSelected = !!(selected && r && r.bookingId === selected.id);

                return (
                  <button
                    key={tb + t}
                    type="button"
                    className={[
                      "cell", "cell-slot",
                      r ? "cell-reserved" : "cell-free",
                      isSelected ? "cell-selected" : "",
                    ].join(" ")}
                    onClick={() => onCellClick(t, tb)}
                    disabled={!r}
                    title={r ? r.customerName : "Ingen booking"}
                  >
                    <div className="cell-content">
                      <span className="cell-label">{r ? "Opptatt" : "Ingen booking"}</span>
                      {r && <span className="cell-name">{r.customerName}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="selection-panel">
        <h3>Valgt booking</h3>
        {!selected ? (
          <p className="selection-info">Klikk på en <b>opptatt</b> rute i kalenderen for å redigere.</p>
        ) : (
          <form className="booking-form" onSubmit={saveChanges}>
            <p className="selection-info">
              ID <b>#{selected.id}</b> • Bord <b>{selected.table_id}</b> • Fra{" "}
              <b>{new Date(selected.from_date_time).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}</b>{" "}
              til{" "}
              <b>{new Date(selected.until_date_time).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}</b>
            </p>

            <div className="form-row">
              <label>
                Fornavn
                <input
                  type="text"
                  value={selected.customer_first_name ?? ""}
                  onChange={(e) => setSelected({ ...selected!, customer_first_name: e.target.value })}
                />
              </label>
              <label>
                Etternavn
                <input
                  type="text"
                  value={selected.customer_last_name ?? ""}
                  onChange={(e) => setSelected({ ...selected!, customer_last_name: e.target.value })}
                />
              </label>
            </div>

            <div className="form-row">
              <label className="full-width">
                E-post
                <input
                  type="email"
                  value={selected.customer_email ?? ""}
                  onChange={(e) => setSelected({ ...selected!, customer_email: e.target.value })}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Status
                <select
                  className="status-select"
                  value={selected.status ?? "CONFIRMED"}
                  onChange={(e) => setSelected({ ...selected!, status: e.target.value })}
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="NO_SHOW">NO_SHOW</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </label>

              <label>
                Bord
                <select
                  className="status-select"
                  value={selected.table_id}
                  onChange={(e) => setSelected({ ...selected!, table_id: Number(e.target.value) })}
                >
                  {tables.map((t, i) => (
                    <option key={t} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Start
                <select
                  className="status-select"
                  value={new Date(selected.from_date_time).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit", hour12: false })}
                  onChange={(e) => updateTime("from_date_time", e.target.value)}
                >
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label>
                Slutt
                <select
                  className="status-select"
                  value={new Date(selected.until_date_time).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit", hour12: false })}
                  onChange={(e) => updateTime("until_date_time", e.target.value)}
                >
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>

            {saveMsg && (
              <div className={saveMsg.includes("✅") ? "success-banner small" : "error-banner small"}>
                {saveMsg}
              </div>
            )}

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Lagrer…" : "Lagre endringer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}