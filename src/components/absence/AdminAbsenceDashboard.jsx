// src/components/absence/AdminAbsenceDashboard.jsx
import React, { useEffect, useState } from "react";
import { GROUPS } from "../../lib/constants";
import { StorageService } from "../../lib/storage";
import { CheckCircle, Undo2, Trash2, CalendarDays } from "lucide-react";

// Grundfarben – TERMIN & URLAUB getauscht
const REASON_STYLES = {
  krankheit: "bg-amber-100 text-amber-900",
  termin: "bg-emerald-100 text-emerald-900", // jetzt GRÜN
  urlaub: "bg-sky-100 text-sky-900",         // jetzt BLAU
  sonstiges: "bg-stone-200 text-stone-800",
};

export default function AdminAbsenceDashboard({ user }) {
  const [groupId, setGroupId] = useState(user.primaryGroup || "erde");
  const [activeTab, setActiveTab] = useState("new"); // new | read
  const [entries, setEntries] = useState([]);

  const load = () => {
    const all = StorageService.get("absences") || [];

    const filtered = all.filter((e) => e.groupId === groupId);

    // automatische Bereinigung abgelaufener, bereits gelesener Meldungen
    const cleaned = filtered.filter((e) => {
      if (e.status !== "read") return true;
      const end = e.type === "range" ? e.dateTo : e.dateFrom;
      return new Date(end) >= new Date(); 
    });

    if (cleaned.length !== filtered.length) {
      const rest = all.filter((e) => e.groupId !== groupId);
      StorageService.set("absences", [...rest, ...cleaned]);
    }

    setEntries(cleaned);
  };

  useEffect(() => {
    load();
  }, [groupId]);

  const markRead = (id) => {
    const all = StorageService.get("absences") || [];
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) return;
    all[idx].status = "read";
    StorageService.set("absences", all);
    load();
  };

  const markUnread = (id) => {
    const all = StorageService.get("absences") || [];
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) return;
    all[idx].status = "new";
    StorageService.set("absences", all);
    load();
  };

  const remove = (id) => {
    if (!confirm("Meldung löschen?")) return;
    const all = StorageService.get("absences") || [];
    const filtered = all.filter((e) => e.id !== id);
    StorageService.set("absences", filtered);
    load();
  };

  const newEntries = entries
    .filter((e) => e.status === "new")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const readEntries = entries
    .filter((e) => e.status === "read")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const currentGroup = GROUPS.find((g) => g.id === groupId);

  const dateLabel = (e) => {
    if (e.type === "single") return formatDate(e.dateFrom);
    return `${formatDate(e.dateFrom)} – ${formatDate(e.dateTo)}`;
  };

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("de-DE");
  }

  const renderCard = (e, faded = false) => {
    const reasonStyle = REASON_STYLES[e.reason] || REASON_STYLES.sonstiges;

    return (
      <div
        key={e.id}
        className={`p-4 rounded-2xl border shadow-sm ${
          faded
            ? "bg-stone-50 border-stone-200 opacity-70"
            : "bg-white border-amber-200"
        }`}
      >
        {/* obere Zeile: Name links – Gruppenchip + Buttons rechts */}
        <div className="flex justify-between items-start gap-4">

          {/* Linker Bereich */}
          <div className="flex-1 space-y-1">
            <p className="font-bold text-sm text-stone-800">{e.childName}</p>

            <p className="text-xs text-stone-600 flex items-center gap-1">
              <CalendarDays size={12} className="text-stone-400" />
              {dateLabel(e)}
            </p>

            {/* Grund-Badge */}
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${reasonStyle}`}
            >
              {e.reason === "sonstiges"
                ? e.otherText || "Sonstiges"
                : e.reason.charAt(0).toUpperCase() + e.reason.slice(1)}
            </span>

            {/* Einreichungsdatum */}
            <p className="text-[10px] text-stone-400 mt-1">
              Eingereicht am {new Date(e.createdAt).toLocaleString("de-DE")}
            </p>
          </div>

          {/* Rechter Bereich */}
          <div className="flex flex-col items-end gap-2">

            {/* Gruppenchip */}
            {currentGroup && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${currentGroup.color}`}
              >
                {currentGroup.icon} {currentGroup.name}
              </span>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              {e.status === "new" ? (
                <button
                  onClick={() => markRead(e.id)}
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                >
                  <CheckCircle size={16} />
                </button>
              ) : (
                <button
                  onClick={() => markUnread(e.id)}
                  className="p-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300"
                >
                  <Undo2 size={16} />
                </button>
              )}

              <button
                onClick={() => remove(e.id)}
                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div
        className={`p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col gap-3 ${currentGroup.light}`}
      >
        <div className="flex items-center gap-3">
          <div className={`${currentGroup.color} p-2 rounded-2xl text-white shadow`}>
            {currentGroup.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Meldungen</h2>
            <p className="text-xs text-stone-600">
              Abwesenheiten der Gruppe {currentGroup.name}
            </p>
          </div>
        </div>

        {/* CHIP-Auswahl */}
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGroupId(g.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap transition ${
                g.id === groupId
                  ? `${g.color} border-transparent text-white`
                  : "bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100"
              }`}
            >
              {g.icon}
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="flex gap-3">
        <button
          className={`flex-1 py-2 rounded-xl text-sm font-bold border transition ${
            activeTab === "new"
              ? "bg-amber-500 text-white border-transparent"
              : "bg-white border-stone-300 text-stone-600 hover:bg-stone-100"
          }`}
          onClick={() => setActiveTab("new")}
        >
          Neu ({newEntries.length})
        </button>

        <button
          className={`flex-1 py-2 rounded-xl text-sm font-bold border transition ${
            activeTab === "read"
              ? "bg-amber-500 text-white border-transparent"
              : "bg-white border-stone-300 text-stone-600 hover:bg-stone-100"
          }`}
          onClick={() => setActiveTab("read")}
        >
          Gelesen ({readEntries.length})
        </button>
      </div>

      {/* LISTEN */}
      {activeTab === "new" && (
        <div className="space-y-3">
          {newEntries.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border text-center text-stone-500">
              Keine neuen Meldungen.
            </div>
          ) : (
            newEntries.map((e) => renderCard(e, false))
          )}
        </div>
      )}

      {activeTab === "read" && (
        <div className="space-y-3">
          {readEntries.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border text-center text-stone-500">
              Keine gelesenen Meldungen.
            </div>
          ) : (
            readEntries.map((e) => renderCard(e, true))
          )}
        </div>
      )}
    </div>
  );
}