import { ArrowRight, ExternalLink, ShoppingBag } from "lucide-react";
import Image from "next/image";

import affiliateFallback from "@/assets/images/auth/login-yoga.webp";
import type { LandingAffiliateProduct } from "@/types/landing-affiliate-product";

export function AffiliateProductListing({ products, error }: { products: LandingAffiliateProduct[]; error?: string }) {
  return (
    <main className="pdf-landing-page affiliate-landing-page">
      <section className="pdf-landing-hero">
        <div className="kratika-yoga-container">
          <p className="platform-eyebrow">Curated for your practice</p>
          <h1>Essentials for a calmer, more comfortable practice.</h1>
          <p>Thoughtfully selected yoga mats, props and wellness essentials to support your home practice.</p>
        </div>
      </section>
      <section className="pdf-landing-list-section">
        <div className="kratika-yoga-container">
          <div className="pdf-landing-list-heading">
            <h2>Recommended essentials.</h2>
            <span>{products.length} products</span>
          </div>
          {error && <p className="landing-course-message error">{error}</p>}
          {!error && products.length === 0 && (
            <p className="landing-course-message">No recommended products available right now.</p>
          )}
          <div className="pdf-landing-grid affiliate-landing-grid">
            {products.map((product, index) => (
              <article className="pdf-landing-card" key={product.id || `${product.title}-${index}`}>
                <div className="pdf-landing-card-image affiliate-landing-card-image">
                  <Image
                    src={product.thumbnailUrl || affiliateFallback}
                    alt={product.title}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  />
                  <span className="affiliate-landing-badge">Affiliate recommendation</span>
                </div>
                <div className="pdf-landing-card-content">
                  <div className="w-full">
                    <div className="pdf-landing-card-meta">
                      <span>
                        <ShoppingBag size={16} /> Wellness essential
                      </span>
                    </div>
                    <h3 className="line-clamp-2 w-full">{product.title}</h3>
                    <div className="line-clamp-4 w-full rich-text-description" dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                  {product.productsLink ? (
                    <a className="pdf-landing-card-action" href={product.productsLink} target="_blank" rel="noreferrer">
                      {product.buttonTitle} <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span className="pdf-landing-card-action disabled">
                      Product link unavailable <ArrowRight size={16} />
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
