import { testimonials } from "@/data/landing-page";
import { getLandingReviews } from "@/lib/api/landing-reviews";
import type { LandingReview } from "@/types/landing-review";
import { TestimonialSwiper } from "./testimonial-swiper";

export function TestimonialsSkeleton() {
  return (
    <section className="platform-testimonials" aria-label="Loading student reviews">
      <div className="kratika-yoga-container">
        <div className="platform-testimonials-heading">
          <div className="platform-testimonial-skeleton platform-testimonial-skeleton-heading" />
          <div className="platform-testimonial-skeleton platform-testimonial-skeleton-copy" />
        </div>
        <div className="platform-testimonial-skeleton-grid" aria-hidden="true">
          {[1, 2, 3].map((item) => (
            <div className="platform-testimonial-skeleton platform-testimonial-skeleton-card" key={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export async function TestimonialsSection() {
  const { reviews: apiReviews, error } = await getLandingReviews();
  const staticReviews: LandingReview[] = testimonials.map((review, index) => ({
    id: `static-review-${index}`,
    rating: review.rating,
    comment: review.content,
    createdAt: "",
    userName: review.name,
    courseTitle: review.course,
  }));
  const reviews = [...apiReviews, ...staticReviews].slice(0, 5);

  return <TestimonialSwiper reviews={reviews} error={reviews.length > 0 ? undefined : error} />;
}
