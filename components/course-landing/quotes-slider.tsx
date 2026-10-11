"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { COMMON_BORDER_RADIUS } from "@/lib/constants/layout";
import { Txt } from "./landing-text";

/**
 * Student quotes, 3 at a time on wide screens (2 on tablets, 1 on phones), with arrows at the bottom right.
 * The arrows hide themselves when every quote already fits.
 */
export function QuotesSlider({ quotes }: { quotes: { text?: string | null; name?: string | null }[] }) {
  return (
    <div className="lp-quotes">
      <Swiper
        breakpoints={{ 640: { slidesPerView: 2 }, 1000: { slidesPerView: 3 } }}
        modules={[Navigation, A11y]}
        navigation={{ nextEl: ".lp-quotes-next", prevEl: ".lp-quotes-prev" }}
        slidesPerView={1}
        spaceBetween={16}>
        {quotes.map((quote, index) => (
          <SwiperSlide key={index}>
            <blockquote className={COMMON_BORDER_RADIUS}>
              “<Txt text={quote?.text ?? ""} />”{quote?.name && <cite>{quote.name}</cite>}
            </blockquote>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="lp-quotes-controls">
        <button aria-label="Previous quotes" className="lp-quotes-prev" type="button">
          <ArrowLeft size={20} />
        </button>
        <button aria-label="Next quotes" className="lp-quotes-next" type="button">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
