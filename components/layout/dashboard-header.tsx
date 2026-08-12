import { Menu, UserRound } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <button className="mobile-menu" aria-label="Open menu"><Menu /></button>
      <div className="header-actions">
        <button aria-label="Profile" className="header-profile"><UserRound size={23} /></button>
      </div>
    </header>
  )
}
