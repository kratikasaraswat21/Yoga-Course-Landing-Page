import Link from "next/link";

import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Website sitemap", "Browse the Kratika Yoga website, including courses, programs, recommendations and useful information.", "/sitemap");

const companyPages = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms" },
];

const servicePages = [
  { label: "Video Courses", href: "/courses" },
  { label: "PDF Yoga Programs", href: "/pdf-courses" },
  { label: "Affiliate Products", href: "/affiliate-products" },
];

function SitemapGroup({ title, links }: { title: string; links: typeof companyPages }) {
  return (
    <section className="sitemap-group">
      <h2>{title}</h2>
      <div className="sitemap-link-list">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="sitemap-link">
            {link.label}
            <span aria-hidden="true">•</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function SitemapPage() {
  return (
    <div className="landing-page sitemap-page">
      <Navbar />
      <main className="simple-site-page">
        <div className="kratika-yoga-container">
          <header className="sitemap-header">
            <h1>Explore every <i>Kratika Yoga</i> page</h1>
            <p>Browse the complete website structure, including our courses, programs, recommendations and useful information.</p>
          </header>
          <nav aria-label="Sitemap">
            <SitemapGroup title="Company Pages" links={companyPages} />
            <SitemapGroup title="Practice & Services" links={servicePages} />
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
