"use client";

import type { VerifiedUser } from "@/types/auth";
import { createContext, useContext, type ReactNode } from "react";

const DashboardSessionContext = createContext<VerifiedUser | null>(null);

export function DashboardSession({ user, children }: { user: VerifiedUser | null; children: ReactNode }) {
  return <DashboardSessionContext.Provider value={user}>{children}</DashboardSessionContext.Provider>;
}

export function useDashboardSession() {
  return useContext(DashboardSessionContext);
}
