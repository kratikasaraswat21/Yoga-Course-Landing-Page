import { Star } from "lucide-react";

export function CourseRatingStars({ rating, label }: { rating: number; label?: string }) {
  const safeRating = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;
  const gradientId = `rating-${Math.round(safeRating * 10)}`;

  return <span className="course-rating-stars" aria-label={label ?? `${safeRating.toFixed(1)} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => {
      const fill = index < fullStars ? "currentColor" : index === fullStars && hasHalfStar ? `url(#${gradientId})` : "none";
      return <Star key={index} size={18} fill={fill} strokeWidth={1.8} />;
    })}
    {hasHalfStar && <svg aria-hidden="true" className="course-rating-gradient" width="0" height="0"><defs><linearGradient id={gradientId}><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="transparent" /></linearGradient></defs></svg>}
  </span>;
}
