import { Skeleton } from "@/components/ui/skeleton";

export function PdfCourseListingSkeleton() {
  return (
    <div className="courses-page course-listing-skeleton" aria-label="Loading PDF courses" role="status">
      <section className="courses-hero"><div><Skeleton className="listing-eyebrow" /><Skeleton className="listing-title" /><Skeleton className="listing-copy" /></div><Skeleton className="listing-hero-art" /></section>
      <Skeleton className="listing-search" />
      <div className="catalog-grid">{[1, 2, 3].map((item) => <div className="catalog-card listing-card-skeleton" key={item}><Skeleton className="listing-card-image" /><div className="listing-card-copy"><Skeleton className="listing-meta" /><Skeleton className="listing-card-title" /><Skeleton className="listing-card-description" /><Skeleton className="listing-card-price" /></div></div>)}</div>
    </div>
  );
}
