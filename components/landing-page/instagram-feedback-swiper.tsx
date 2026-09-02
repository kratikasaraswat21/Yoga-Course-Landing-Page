"use client";

import feedback1 from "@/assets/images/insta-feed-back/insta-feed-back-1.webp";
import feedback2 from "@/assets/images/insta-feed-back/insta-feed-back-2.webp";
import feedback3 from "@/assets/images/insta-feed-back/insta-feed-back-3.webp";
import feedback4 from "@/assets/images/insta-feed-back/insta-feed-back-4.webp";
import feedback5 from "@/assets/images/insta-feed-back/insta-feed-back-5.webp";
import feedback6 from "@/assets/images/insta-feed-back/insta-feed-back-6.webp";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const feedbackImages = [feedback1, feedback2, feedback3, feedback4, feedback5, feedback6];

export function InstagramFeedbackSwiper() {
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
          {feedbackImages.map((image, imageIndex) => (
            <SwiperSlide key={image.src}>
              <div className="landing-instagram-feedback-card">
                <Image
                  src={image}
                  alt={`Instagram feedback ${imageIndex + 1}`}
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
