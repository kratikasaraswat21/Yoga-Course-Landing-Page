import Link from "next/link";

export default function SitemapPage() {
  return <main className="simple-site-page"><div className="kratika-yoga-container"><h1>Sitemap</h1><nav aria-label="Sitemap"><ul><li><Link href="/">Home</Link></li><li><Link href="/courses">Courses</Link></li><li><Link href="/pdf-courses">PDF courses</Link></li><li><Link href="/affiliate-products">Affiliate products</Link></li><li><Link href="/#faq">FAQ</Link></li></ul></nav></div></main>;
}
