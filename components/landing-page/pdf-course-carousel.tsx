"use client";

import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import pdfFallback from "@/assets/images/landing/pdf/pdf-program-dummy.png";
import { formatCurrency } from "@/lib/formatters/currency";
import type { LandingPdfCourse } from "@/types/landing-pdf-course";

export function PdfCourseCarousel({ courses, error }: { courses: LandingPdfCourse[]; error?: string }) {
  return (
    <section className="platform-pdf-carousel" id="pdf-programs">
      <div className="kratika-yoga-container">
        <div className="platform-pdf-heading">
          <h2>
            Guidance you can return
            <br />
            to, on and off the mat.
          </h2>
          <div className="platform-pdf-heading-actions">
            <a href="/pdf-courses">
              Explore all PDF programs <ArrowRight size={18} />
            </a>
            <div className="platform-pdf-carousel-footer">
              <button className="pdf-carousel-prev" aria-label="Previous PDF program">
                <ArrowLeft size={22} />
              </button>
              <div className="platform-pdf-progress">
                <span />
              </div>
              <button className="pdf-carousel-next" aria-label="Next PDF program">
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          navigation={{ nextEl: ".pdf-carousel-next", prevEl: ".pdf-carousel-prev" }}
          pagination={{ el: ".pdf-carousel-pagination", type: "fraction" }}
          slidesPerView={1}
          spaceBetween={32}>
          {courses.slice(0, 5).map((course, index) => (
            <SwiperSlide key={course.id || `${course.title}-${index}`}>
              <article className="platform-pdf-feature-slide">
                <div
                  className={`platform-pdf-visual platform-pdf-visual-${index % 3}`}
                  style={{ backgroundImage: `url(${course.thumbnailUrl || pdfFallback.src})` }}
                />
                <div className="platform-pdf-feature-copy">
                  <div className="platform-pdf-detail">
                    <h3 className="line-clamp-2">{course.title}</h3>
                    <p className="line-clamp-4">{course.description}</p>
                    <div className="platform-pdf-meta">
                      <span>
                        <Users size={22} />
                        {course.enrolledStudents} enrolled students
                      </span>
                    </div>
                    <strong>{formatCurrency(course.totalPayableAmount)}</strong>
                    <small>{formatCurrency(course.price)} · {course.discount}% OFF</small>
                    <a className="landing-button landing-button-light" href={`/pdf-course/${course.id}`}>
                      View PDF program <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        {error && <p className="landing-course-message error">{error}</p>}
        {!error && courses.length === 0 && <p className="landing-course-message">No PDF courses available right now.</p>}
      </div>
    </section>
  );
}
