import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { logo } from "@/assets/image-assets";
import { footerColumns } from "@/data/landing-page";

export function Footer() {
  return (
    <footer className="landing-footer">
      <div className="kratika-yoga-container">
        <div className="landing-footer-top">
          <a className="landing-brand landing-footer-brand" href="/" aria-label="Kratika Yoga home">
            <Image src={logo} alt="" width={52} height={52} className="landing-brand-mark" />
            <span>Kratika <em>Yoga</em></span>
          </a>
          <p>Thoughtful yoga practices for moving, breathing and reconnecting with yourself.</p>
          <div className="landing-footer-socials" aria-label="Social links"><a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer">ig</a><a href="https://x.com/" aria-label="X" target="_blank" rel="noreferrer">x</a><a href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noreferrer">in</a><a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer">f</a></div>
        </div>
        <div className="landing-footer-links">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <strong>{column.title}</strong>
              {column.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                  {column.title === "Start here" && <ArrowUpRight size={15} />}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="landing-footer-bottom">
          <small>© 2026 Kratika Yoga. All rights reserved.</small>
          <nav aria-label="Legal navigation"><a href="/privacy-policy">Privacy policy</a><a href="/terms">Terms</a><a href="/sitemap">Sitemap</a></nav>
        </div>
      </div>
    </footer>
  );
}
