import { Skeleton } from "@/components/ui/skeleton";

export function CourseDetailSkeleton() {
  return <div className="course-detail-page course-detail-skeleton" aria-label="Loading course details" role="status">
    <Skeleton className="skeleton-breadcrumb" />
    <section className="course-detail-hero skeleton-hero">
      <Skeleton className="skeleton-detail-cover" />
      <div className="skeleton-detail-summary">
        <div className="skeleton-title-row"><Skeleton className="skeleton-title" /><Skeleton className="skeleton-share" /></div>
        <Skeleton className="skeleton-line wide" />
        <Skeleton className="skeleton-line" />
        <Skeleton className="skeleton-price" />
        <Skeleton className="skeleton-stats" />
        <Skeleton className="skeleton-button" />
        <Skeleton className="skeleton-secure" />
      </div>
    </section>
    <section className="course-video-section skeleton-video-section"><Skeleton className="skeleton-heading" /><Skeleton className="skeleton-subheading" /><div className="skeleton-video-grid">{[1, 2, 3, 4].map((item) => <div className="skeleton-video-card" key={item}><Skeleton className="skeleton-video-image" /><Skeleton className="skeleton-card-line" /><Skeleton className="skeleton-card-line short" /></div>)}</div></section>
  </div>;
}

export function CourseListingSkeleton() {
  return <div className="courses-page course-listing-skeleton" aria-label="Loading courses" role="status">
    <section className="courses-hero"><div><Skeleton className="listing-eyebrow" /><Skeleton className="listing-title" /><Skeleton className="listing-copy" /></div><Skeleton className="listing-hero-art" /></section>
    <Skeleton className="listing-search" />
    <div className="catalog-grid">{[1, 2, 3].map((item) => <div className="catalog-card listing-card-skeleton" key={item}><Skeleton className="listing-card-image" /><div className="listing-card-copy"><Skeleton className="listing-meta" /><Skeleton className="listing-card-title" /><Skeleton className="listing-card-description" /><Skeleton className="listing-card-price" /></div></div>)}</div>
  </div>;
}

export function VideoPlaybackSkeleton() {
  return <div className="playback-skeleton" aria-label="Loading video playback" role="status"><Skeleton className="skeleton-breadcrumb" /><div className="playback-layout"><main className="playback-main"><Skeleton className="skeleton-player" /><Skeleton className="skeleton-lesson-label" /><Skeleton className="skeleton-playback-title" /><Skeleton className="skeleton-playback-copy" /><div className="skeleton-navigation"><Skeleton /><Skeleton /></div></main><aside className="playback-sidebar skeleton-playback-sidebar"><Skeleton className="skeleton-sidebar-title" />{[1, 2, 3, 4, 5, 6].map((item) => <Skeleton className="skeleton-lesson-row" key={item} />)}</aside></div></div>;
}
