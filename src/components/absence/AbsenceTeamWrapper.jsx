// src/components/absence/AbsenceTeamWrapper.jsx

import React from "react";
import AdminAbsenceDashboard from "./AdminAbsenceDashboard";

/**
 * Wrapper für Team‑Benutzer im Meldungen‑Tab.
 * Zeigt dieselbe Abwesenheitsübersicht wie das Admin‑Dashboard,
 * aber behält die Überschrift “Abwesenheiten”.
 */
export default function AbsenceTeamWrapper({ user }) {
  return (
    <div className="p-4 space-y-5">
      <h1 className="text-lg font-bold text-stone-800">Abwesenheiten</h1>

      {/* Team nutzt nun die Admin‑Ansicht der Meldungen */}
      <AdminAbsenceDashboard user={user} />
    </div>
  );
}