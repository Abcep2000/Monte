// src/components/ui/AppFooter.jsx
import {
  Home,
  Calendar,
  Users,
  Utensils,
  User,
  Settings,
} from "lucide-react";

export default function AppFooter({ activeTab, setActiveTab, user }) {
  const tabs = [
    { id: "news", label: "News", icon: Home },
    { id: "group", label: "Gruppe", icon: Users },
    { id: "food", label: "Essen", icon: Utensils },
    { id: "absence", label: "Meldungen", icon: Calendar },
    { id: "profile", label: "Profil", icon: User },
  ];

  if (user?.role === "admin") {
    tabs.push({ id: "admin", label: "Admin", icon: Settings });
  }

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        bg-white/95 backdrop-blur-md
        border-t border-stone-200
        shadow-[0_-4px_6px_rgba(0,0,0,0.06)]
        h-16 flex items-center justify-center
      "
    >
      <div className="max-w-3xl mx-auto w-full flex justify-around px-3">

        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;

          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-1 w-14"
            >
              <Icon
                size={22}
                className={active ? "text-amber-600" : "text-stone-400"}
              />
              <span
                className={`
                  text-[10px] font-medium
                  ${active ? "text-amber-600" : "text-stone-400"}
                `}
              >
                {label}
              </span>
            </button>
          );
        })}

      </div>
    </nav>
  );
}