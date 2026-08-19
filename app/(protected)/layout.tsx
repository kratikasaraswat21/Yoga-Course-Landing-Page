"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ReactNode } from "react";
import { useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <button className="sidebar-overlay" aria-label="Close menu" onClick={() => setIsSidebarOpen(false)} />}
      <main className="dashboard-main">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="dashboard-content">
          {children}
          {/* <span className="p-15"></span> */}
        </div>
      </main>
    </div>
  );
}
