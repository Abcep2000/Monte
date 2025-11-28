// src/components/ui/AppShell.jsx
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

export default function AppShell({ children, user, activeTab, setActiveTab }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7]">

      {/* HEADER */}
      <AppHeader user={user} />

      {/* SCROLLING CONTENT */}
      <main
        className="
          flex-1
          overflow-y-auto
          pt-20
          pb-20
          w-full
          max-w-3xl
          mx-auto
          px-4
          hidescrollbar
        "
      >
        {children}
      </main>

      {/* FOOTER */}
      <AppFooter
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}