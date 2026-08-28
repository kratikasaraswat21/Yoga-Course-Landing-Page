"use client";

import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSession } from "@/components/layout/dashboard-session";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { clearLocalSessionStorage } from "@/lib/helper/hepler";
import type { VerifiedUser, VerifyUserResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const navigator = useRouter();
  const useEffectRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<VerifiedUser | null>(null);

  const redirectToLogin = () => {
    clearLocalSessionStorage();
    setUser(null);
    navigator.replace("/login");
  };
  const verifySession = useDebounce(async () => {
    try {
      const [response] = await multipleApiHandler([{ endPoint: "/auth/verify/me", method: "GET", protected: true }]);

      const payload = response?.data as VerifyUserResponse | undefined;
      const verifiedUser = payload?.data?.user_info;

      if (!response?.ok || !payload?.success || !verifiedUser) {
        toast.add({
          title: "Session could not be verified",
          description: "Please sign in again and try again.",
          type: "error",
        });
        redirectToLogin();
      }

      if (verifiedUser) {
        setUser(verifiedUser);
      } else {
        redirectToLogin();
      }
      setIsLoading(false);
    } catch {
      redirectToLogin();
    }
  }, 100);
  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    verifySession();
  }, []);
  if (isLoading) return <DashboardLoading />;
  if (!user) return null;

  return (
    <DashboardSession user={user}>
      <div className="dashboard-shell overflow-hidden">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        {isSidebarOpen && (
          <button className="sidebar-overlay" aria-label="Close menu" onClick={() => setIsSidebarOpen(false)} />
        )}
        <main className="dashboard-main">
          <DashboardHeader isMenuOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen((isOpen) => !isOpen)} />
          <div className="dashboard-content">{children}</div>
        </main>
      </div>
    </DashboardSession>
  );
}
