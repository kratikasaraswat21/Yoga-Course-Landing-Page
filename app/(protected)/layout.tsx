import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-shell overflow-hidden">
      <DashboardSidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        <div className="dashboard-content">
          {children}
          <span className="p-15"></span>
        </div>
      </main>
    </div>
  );
}
