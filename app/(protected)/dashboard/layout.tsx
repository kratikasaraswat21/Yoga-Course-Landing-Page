import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your yoga dashboard",
  description: "Continue your purchased yoga courses, explore new practices, access PDF programs and discover useful recommendations.",
};

export default function DashboardPageLayout({ children }: { children: ReactNode }) {
  return children;
}
