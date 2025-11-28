// src/components/ui/AppHeader.jsx
import KitaLogo from "./KitaLogo";
import { Shield, Users } from "lucide-react";

export default function AppHeader({ user }) {
  const isTeam = user?.role === "team";
  const isAdmin = user?.role === "admin";

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-40
        bg-white/90 backdrop-blur-md
        border-b border-stone-200
        shadow-sm
      "
    >
      <div className="max-w-3xl mx-auto w-full px-4 h-16 flex items-center justify-between">
        
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <KitaLogo size={34} />
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-semibold text-stone-800">
              Montessori Kinderhaus
            </span>
            <span className="text-[11px] text-stone-500 mt-[1px]">
              {user?.username}
            </span>
          </div>
        </div>

        {/* Badge */}
        {(isTeam || isAdmin) && (
          <div
            className="
              px-3 py-1 rounded-lg text-white text-xs font-semibold
              bg-stone-900 flex items-center gap-1
            "
          >
            {isTeam && <Users size={14} />}
            {isAdmin && <Shield size={14} />}
            {isTeam ? "Team" : "Admin"}
          </div>
        )}
      </div>
    </header>
  );
}