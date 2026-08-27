"use client";

import { BookOpen, Home, LogOut, Package, ShoppingBag, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import sidebarLogo from "@/assets/images/logo/logo-transparent.png";
import { clearLocalSessionStorage } from "@/lib/helper/hepler";
import { useDashboardSession } from "./dashboard-session";

export function DashboardSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useDashboardSession();

  const handleLogout = () => {
    clearLocalSessionStorage();
    router.replace("/login");
  };
  return (
    <aside className={`sidebar${isOpen ? " sidebar-open" : ""}`}>
      <Link href="/" className="sidebar-brand">
        <Image src={sidebarLogo} alt="" width={48} height={48} priority />
        <span>Kratika Yoga</span>
      </Link>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <Link aria-label="Dashboard" title="Dashboard" onClick={onClose} className={pathname === "/dashboard" ? "active" : ""} href="/dashboard">
          <Home size={23} />
          <span>Dashboard</span>
        </Link>
        <Link
          aria-label="Courses"
          title="Courses"
          onClick={onClose}
          className={pathname.startsWith("/course/") || pathname === "/my-courses" ? "active" : ""}
          href="/course/enrolled">
          <BookOpen size={23} />
          <span>Courses</span>
        </Link>
        <Link
          aria-label="PDF Courses"
          title="PDF Courses"
          onClick={onClose}
          className={pathname.startsWith("/pdf-course/") ? "active" : ""}
          href="/pdf-course/explore">
          <Package size={23} />
          <span>PDF Courses</span>
        </Link>
        <Link
          aria-label="Affiliate Products"
          title="Affiliate Products"
          onClick={onClose}
          className={pathname.startsWith("/affiliate-products") ? "active" : ""}
          href="/affiliate-products"
          target="_blank"
          rel="noreferrer">
          <ShoppingBag size={23} />
          <span>Affiliate Products</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <div className="profile-avatar">
          <UserRound size={22} />
        </div>
        <div>
          <strong>{user?.name ?? "Yoga student"}</strong>
        </div>
      </div>
      <button className="logout" aria-label="Log out" title="Log out" type="button" onClick={handleLogout}>
        <LogOut size={23} /> <span>Log out</span>
      </button>
    </aside>
  );
}
