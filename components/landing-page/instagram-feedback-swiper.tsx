"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { FeedbackImage } from "./feedback-images";

export function InstagramFeedbackSwiper({ images }: { images: FeedbackImage[] }) {
  return (
    <section className="landing-instagram-feedback" aria-label="Instagram feedback">
      <div className="kratika-yoga-container">
        <div className="landing-instagram-feedback-heading">
          <div>
            <h2>Real practice. Real progress.</h2>
          </div>
          <p className="text-justify">
            See how the Kratika Yoga community is making space for movement, breath and a practice that lasts.
          </p>
        </div>
        <Swiper
          className="landing-instagram-feedback-swiper"
          modules={[Navigation, A11y]}
          navigation={{ nextEl: ".instagram-feedback-next", prevEl: ".instagram-feedback-prev" }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1100: { slidesPerView: 4 } }}>
          {images.map((image) => (
            <SwiperSlide key={image.key}>
              <div className="landing-instagram-feedback-card">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1099px) 50vw, 25vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="landing-instagram-feedback-controls">
          <button className="instagram-feedback-prev" type="button" aria-label="Previous Instagram feedback">
            <ArrowLeft size={20} />
          </button>
          <button className="instagram-feedback-next" type="button" aria-label="Next Instagram feedback">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
