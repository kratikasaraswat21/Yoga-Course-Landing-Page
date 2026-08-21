"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { logo } from "@/assets/image-assets";
import { landingNavLinks } from "@/data/landing-page";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="landing-navbar">
      <div className="kratika-yoga-container landing-navbar-inner">
        <a className="landing-brand" href="/" aria-label="Kratika Yoga home">
          <Image
            src={logo}
            alt=""
            width={52}
            height={52}
            className="landing-brand-mark"
          />
          <span>Kratika <em>Yoga</em></span>
        </a>

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
          <a className="landing-nav-cta" href="/login">Start your practice <ArrowRight aria-hidden="true" size={17} /></a>
        </nav>
      </div>
    </header>
  );
}
