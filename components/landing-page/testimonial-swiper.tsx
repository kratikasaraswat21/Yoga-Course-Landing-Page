"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { LandingReview } from "@/types/landing-review";

export function TestimonialSwiper({ reviews, error }: { reviews: LandingReview[]; error?: string }) {
  return (
    <section className="platform-testimonials" id="testimonials">
      <div className="kratika-yoga-container">
        <div className="platform-testimonials-heading">
          <div>
            <h2>What students are saying.</h2>
          </div>
          <p className="text-justify">Small, steady changes can make a meaningful difference. Here’s what our students are experiencing.</p>
        </div>
        {error && <p className="landing-course-message error">{error}</p>}
        {!error && reviews.length === 0 && <p className="landing-course-message">No reviews available yet.</p>}
        {!error && reviews.length > 0 && <Swiper
          className="platform-testimonial-swiper"
          modules={[Navigation, A11y]}
          navigation={{ nextEl: ".testimonial-next", prevEl: ".testimonial-prev" }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 700: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}>
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <article className="platform-testimonial-card rounded-lg! md:rounded-xl! lg:rounded-2xl!">
                <div>
                  <div className="platform-testimonial-rating" aria-label={`${review.rating} out of 5 stars`} role="img">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} size={18} fill={index < Math.round(review.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <blockquote className="line-clamp-4 text-justify">“{review.comment}”</blockquote>
                </div>
                <div className="platform-testimonial-author">
                  <strong>{review.userName}</strong>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>}
        {!error && reviews.length > 3 && <div className="platform-testimonial-controls">
          <button className="testimonial-prev" aria-label="Previous testimonial">
            <ArrowLeft size={20} />
          </button>
          <button className="testimonial-next" aria-label="Next testimonial">
            <ArrowRight size={20} />
          </button>
        </div>}
      </div>
    </section>
  );
}
