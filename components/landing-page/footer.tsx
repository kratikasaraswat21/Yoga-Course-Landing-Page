import { Mail } from "lucide-react";
import Image from "next/image";
import { FaInstagram, FaYoutube } from "react-icons/fa";

import footerLogo from "@/assets/images/logo/logo-transparent.png";
import { landingNavLinks } from "@/data/landing-page";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="landing-footer">
      <div className="kratika-yoga-container">
        <div className="landing-footer-top">
          <div className="landing-footer-about">
            <Link className="landing-brand landing-footer-brand" href="/" aria-label="Kratika Yoga home">
              <Image src={footerLogo} alt="" width={52} height={52} />
              <span>
                Kratika <em>Yoga</em>
              </span>
            </Link>
            <p>Thoughtful yoga practices for moving, breathing and reconnecting with yourself.</p>
          </div>
          <nav className="landing-footer-column" aria-label="Footer navigation">
            <strong>Navigation</strong>
            {landingNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="landing-footer-column landing-footer-contact">
            <strong>Contact</strong>
            <a href="mailto:hello@kratikayoga.com">
              <Mail size={19} aria-hidden="true" />
              hello@kratikayoga.com
            </a>
            <a href="https://www.instagram.com/kratikayoga/" target="_blank" rel="noreferrer">
              <FaInstagram aria-hidden="true" />
              @kratikayoga
            </a>
            <a href="https://www.youtube.com/@KratikaYoga" target="_blank" rel="noreferrer">
              <FaYoutube aria-hidden="true" />
              Kratika Yoga
            </a>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <small>© 2026 Kratika Yoga. All rights reserved.</small>
          <nav aria-label="Legal navigation">
            <a href="/privacy-policy">Privacy policy</a>
            <a href="/terms">Terms</a>
            <a href="/sitemap">Sitemap</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
