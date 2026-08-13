"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Flower2, Home, LogOut, Package, ShoppingBag, UserRound } from "lucide-react"

export function DashboardSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  return (
    <aside className={`sidebar${isOpen ? " sidebar-open" : ""}`}>
      <Link href="/" className="sidebar-brand">
        <Flower2 size={42} strokeWidth={1.15} />
        <span>Kratika Yoga</span>
      </Link>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <Link onClick={onClose} className={pathname === "/dashboard" ? "active" : ""} href="/dashboard"><Home size={23} /><span>Dashboard</span></Link>
        <Link onClick={onClose} className={pathname === "/my-courses" ? "active" : ""} href="/my-courses"><BookOpen size={23} /><span>Courses</span></Link>
        <Link onClick={onClose} href="#pdf-courses"><Package size={23} /><span>PDF Courses</span></Link>
        <Link onClick={onClose} href="#affiliate-products"><ShoppingBag size={23} /><span>Affiliate Products</span></Link>
      </nav>
      <div className="sidebar-footer">
        <div className="profile-avatar"><UserRound size={22} /></div>
        <div><strong>Varun Patel</strong><small>varun@email.com</small></div>
      </div>
      <button className="logout"><LogOut size={23} /> Log out</button>
    </aside>
  )
}
