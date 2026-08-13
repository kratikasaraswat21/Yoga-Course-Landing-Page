import { Menu, UserRound } from "lucide-react"

export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="dashboard-header">
      <button className="mobile-menu" aria-label="Open menu" onClick={onMenuClick}><Menu /></button>
      <div className="header-actions">
        <button aria-label="Profile" className="header-profile"><UserRound size={23} /></button>
      </div>
    </header>
  )
}
