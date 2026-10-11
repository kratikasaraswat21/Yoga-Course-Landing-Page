"use client";

import logo from "@/assets/images/logo/logo.png";
import { landingNavLinks } from "@/data/landing-page";
import { BOOK_A_CALL_URL } from "@/lib/constants/links";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="landing-navbar">
      <div className="kratika-yoga-container landing-navbar-inner">
        <Link className="landing-brand" href="/" aria-label="Kratika Yoga home">
          <Image src={logo} alt="" width={52} height={52} className="landing-brand-mark" />
          <span className="hidden sm:block">KratikaYoga</span>
        </Link>

        <nav className="landing-nav-links" aria-label="Main navigation">
          {landingNavLinks.map((link) => (
            <a
              key={link.href}
              className={pathname === link.href ? "landing-nav-link-active" : undefined}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="landing-nav-actions">
          <a className="landing-nav-book" href={BOOK_A_CALL_URL} target="_blank" rel="noopener noreferrer">
            Book a call
          </a>
          <a className="landing-nav-cta" href="/login">
            Start your practice <ArrowRight aria-hidden="true" size={17} />
          </a>
        </div>
      </div>
    </header>
  );
}
