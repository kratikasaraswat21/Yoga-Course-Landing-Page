import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";
import type { ReactNode } from "react";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="landing-page">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
