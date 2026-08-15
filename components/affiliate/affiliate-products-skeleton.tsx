import { Skeleton } from "@/components/ui/skeleton";

export function AffiliateProductsSkeleton() {
  return (
    <div className="courses-page affiliate-products-page course-listing-skeleton" aria-label="Loading affiliate products" role="status">
      <section className="courses-hero"><div><Skeleton className="listing-eyebrow" /><Skeleton className="listing-title" /><Skeleton className="listing-copy" /></div><Skeleton className="listing-hero-art" /></section>
      <div className="product-grid affiliate-product-grid affiliate-products-skeleton-grid">
        {[1, 2, 3].map((item) => <div className="product-card" key={item}><Skeleton className="affiliate-skeleton-image" /><div className="product-info"><Skeleton className="affiliate-skeleton-title" /><Skeleton className="affiliate-skeleton-description" /><Skeleton className="affiliate-skeleton-button" /></div></div>)}
      </div>
    </div>
  );
}
