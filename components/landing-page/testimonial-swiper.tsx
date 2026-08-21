"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { testimonials } from "@/data/landing-page";

export function TestimonialSwiper() {
  return (
    <section className="platform-testimonials" id="testimonials">
      <div className="kratika-yoga-container">
        <div className="platform-testimonials-heading">
          <div>
            <h2>What students are saying.</h2>
          </div>
          <p>Small, steady changes can make a meaningful difference. Here’s what our students are experiencing.</p>
        </div>
        <Swiper
          className="platform-testimonial-swiper"
          modules={[Navigation, A11y]}
          navigation={{ nextEl: ".testimonial-next", prevEl: ".testimonial-prev" }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 700: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}>
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.name}>
              <article className="platform-testimonial-card">
                <div>
                  <div className="platform-testimonial-rating" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: testimonial.rating }, (_, index) => (
                      <Star key={index} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="line-clamp-4">“{testimonial.content}”</blockquote>
                </div>
                <div className="platform-testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.course}</span>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="platform-testimonial-controls">
          <button className="testimonial-prev" aria-label="Previous testimonial">
            <ArrowLeft size={20} />
          </button>
          <button className="testimonial-next" aria-label="Next testimonial">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
