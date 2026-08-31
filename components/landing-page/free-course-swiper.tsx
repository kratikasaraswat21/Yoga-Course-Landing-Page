"use client";

import { freeCourses } from "@/data/landing-page";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export function FreeCourseSwiper() {
  return (
    <section className="platform-free-courses" id="free-courses">
      <div className="kratika-yoga-container">
        <div className="platform-free-courses-heading">
          <h2>
            Begin with a practice
            <br />
            that’s completely free.
          </h2>
          <div className="platform-free-courses-side">
            <p className="text-justify">
              Explore short, beginner-friendly sessions designed to help you experience Kratika’s teaching, understand
              the foundations and begin practising with confidence.
            </p>
            <div className="platform-free-course-controls">
              <button className="free-course-prev" aria-label="Previous free course">
                <ArrowRight size={23} />
              </button>
              <button className="free-course-next" aria-label="Next free course">
                <ArrowRight size={23} />
              </button>
            </div>
          </div>
        </div>
        <div className="platform-free-swiper-wrap">
          <Swiper
            modules={[Navigation, A11y]}
            navigation={{ nextEl: ".free-course-next", prevEl: ".free-course-prev" }}
            spaceBetween={28}
            slidesPerView={1.08}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1400: { slidesPerView: 3.35 } }}>
            {freeCourses.map(({ image, title, description, link }) => (
              <SwiperSlide key={title}>
                <article className="platform-free-card rounded-lg! md:rounded-xl! lg:rounded-2xl!">
                  <div className="platform-free-card-image">
                    <Image src={image} alt={title} width={1920} height={1080} className="aspect-video" />
                    <span className="platform-card-play">
                      <Play size={20} fill="currentColor" />
                    </span>
                  </div>
                  <div className="platform-free-card-copy">
                    <h3>{title}</h3>
                    <p className="text-justify">{description}</p>
                    <div className="platform-free-card-meta">
                      <Link target="_blank" href={link}>
                        Start practising <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
