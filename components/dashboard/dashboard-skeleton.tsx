import { Skeleton } from "@/components/ui/skeleton";

function PanelHeadingSkeleton() {
  return <div className="panel-heading dashboard-skeleton-heading"><Skeleton className="dashboard-skeleton-title" /><Skeleton className="dashboard-skeleton-link" /></div>;
}

function CourseCardSkeleton() {
  return <div className="dashboard-skeleton-card"><Skeleton className="dashboard-skeleton-card-image" /><div className="dashboard-skeleton-card-copy"><Skeleton className="dashboard-skeleton-line title" /><Skeleton className="dashboard-skeleton-line" /><Skeleton className="dashboard-skeleton-line short" /><Skeleton className="dashboard-skeleton-progress" /><Skeleton className="dashboard-skeleton-button" /></div></div>;
}

function ProductCardSkeleton() {
  return <div className="dashboard-skeleton-product"><Skeleton className="dashboard-skeleton-product-image" /><div className="dashboard-skeleton-product-copy"><Skeleton className="dashboard-skeleton-line title" /><Skeleton className="dashboard-skeleton-line short" /><Skeleton className="dashboard-skeleton-button" /></div></div>;
}

export function DashboardSkeleton() {
  return <div className="dashboard-skeleton" aria-label="Loading dashboard" role="status">
    <section className="welcome-card dashboard-skeleton-welcome"><Skeleton className="dashboard-skeleton-welcome-copy" /><Skeleton className="dashboard-skeleton-welcome-image" /></section>
    <div className="dashboard-grid top-grid"><section className="panel"><PanelHeadingSkeleton /><div className="course-grid"><CourseCardSkeleton /><CourseCardSkeleton /></div></section><section className="panel"><PanelHeadingSkeleton /><div className="dashboard-skeleton-explore"><Skeleton className="dashboard-skeleton-explore-image" /><div><Skeleton className="dashboard-skeleton-line title" /><Skeleton className="dashboard-skeleton-line short" /><Skeleton className="dashboard-skeleton-line" /></div></div><div className="dashboard-skeleton-explore"><Skeleton className="dashboard-skeleton-explore-image" /><div><Skeleton className="dashboard-skeleton-line title" /><Skeleton className="dashboard-skeleton-line short" /><Skeleton className="dashboard-skeleton-line" /></div></div></section></div>
    <div className="dashboard-grid bottom-grid"><section className="panel"><PanelHeadingSkeleton /><div className="pdf-grid"><CourseCardSkeleton /><CourseCardSkeleton /></div></section><section className="panel"><PanelHeadingSkeleton /><div className="product-grid"><ProductCardSkeleton /><ProductCardSkeleton /></div></section></div>
  </div>;
}
