// src/components/absence/AbsenceArea.jsx

import React from "react";

// Eltern‑Ansicht
import AbsenceReport from "./AbsenceReport";

// Team‑Ansicht (Wrapper wird künftig nicht mehr genutzt)
import AbsenceTeamWrapper from "./AbsenceTeamWrapper";

// Admin‑Ansicht
import AdminAbsenceDashboard from "./AdminAbsenceDashboard";

export default function AbsenceArea({ user }) {
  const role = user?.role;
  if (!role) return null;

  // Sowohl ADMIN als auch TEAM nutzen künftig dieselbe Übersicht
  if (role === "admin" || role === "team") {
    return <AdminAbsenceDashboard user={user} />;
  }

  // Eltern können Abwesenheiten melden
  return <AbsenceReport user={user} />;
}