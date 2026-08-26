import { Menu, UserRound } from "lucide-react";

export function DashboardHeader({ onMenuClick, isMenuOpen = false }: { onMenuClick: () => void; isMenuOpen?: boolean }) {
  return (
    <header className="dashboard-header">
      <button
        className="mobile-menu"
        type="button"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        onClick={onMenuClick}>
        <Menu />
      </button>
      <div className="header-actions">
        <button aria-label="Profile" className="header-profile"><UserRound size={23} /></button>
      </div>
    </header>
  )
}
