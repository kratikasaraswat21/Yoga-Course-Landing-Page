"use client";

import courseFallback from "@/assets/images/landing/course/course-main.png";
import { ArrowLeft, ArrowRight, Clock3, Video } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { LandingCourse } from "@/types/landing-course";
import Link from "next/link";
import { CourseRatingStars } from "./course-rating-stars";

export function CourseCarousel({ courses, error }: { courses: LandingCourse[]; error?: string }) {
  const hasMultipleCourses = courses.length > 1;

  return (
    <section
      className={`platform-course-carousel ${hasMultipleCourses ? "platform-course-carousel-multiple" : "platform-course-carousel-single"}`}
      id="course-library">
      <div className="kratika-yoga-container">
        <div className="platform-carousel-heading">
          <h2>Choose the course that meets you where you are.</h2>
          <div className="platform-carousel-heading-copy">
            <p>
              Begin with the level and focus that feel right for you. Each course includes clear guidance, structured
              lessons and lifetime access.
            </p>
            <a className="landing-button landing-button-light" href="/courses">
              Explore all courses <ArrowRight size={18} />
            </a>
          </div>
        </div>
        <div className="platform-free-swiper-wrap">
          {courses.length > 0 && (
            <Swiper
              modules={[Navigation, A11y]}
              navigation={{ nextEl: ".free-course-next", prevEl: ".free-course-prev" }}
              spaceBetween={hasMultipleCourses ? 28 : 0}
              slidesPerView={courses?.length == 1 ? 1 : 1.1}
              breakpoints={{ 640: { slidesPerView: 1 }, 1024: { slidesPerView: 1 } }}>
              {courses.slice(0, 3).map((course) => (
                <SwiperSlide key={course.courseId} className="w-full">
                  <article className="platform-course-feature-slide rounded-lg! md:rounded-xl! lg:rounded-2xl!">
                    <div
                      className="platform-course-feature-image"
                      style={{ backgroundImage: `url(${course.thumbnail || courseFallback.src})` }}
                    />
                    <div className="platform-course-feature-copy">
                      <div className="w-full h-full flex flex-col items-start justify-between">
                        <div className="w-full flex flex-col items-start justify-start">
                          <div className="platform-course-feature-title">
                            <h3 className="line-clamp-2 capitalize">{course.title}</h3>
                          </div>
                          <p className="line-clamp-4 py-6 lg:py-10">{course.description}</p>
                          <div
                            className={`platform-course-feature-meta flex-row! w-full ${
                              hasMultipleCourses ? "" : "platform-course-feature-meta-single"
                            }`}>
                            <span>
                              <Video size={23} />
                              {course.totalVideos} videos
                            </span>
                            <span>
                              <Clock3 size={23} />
                              {course.totalHours} hours
                            </span>
                          </div>
                          <div className="platform-course-feature-rating">
                            <b>{course.rating.toFixed(1)}</b>
                            <CourseRatingStars rating={course.rating} />
                            <small>{course.totalStudents} students</small>
                          </div>
                          <div className="platform-course-feature-price">
                            {course.discount > 0 && (
                              <>
                                <del>₹{course.price.toLocaleString("en-IN")}</del>
                                <small>{course.discount}% off</small>
                              </>
                            )}
                            <strong>₹{(course.discount > 0 ? course.totalPayableAmount : course.price).toLocaleString("en-IN")}</strong>
                          </div>
                        </div>
                        <div className="platform-course-feature-price">
                          <Link
                            className="landing-button landing-button-light"
                            href={`/course/enrolled/${course.courseId}`}>
                            View course <ArrowRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        {error && <p className="landing-course-message error">{error}</p>}
        {!error && courses.length === 0 && <p className="landing-course-message">No courses available right now.</p>}
        {hasMultipleCourses && (
          <div className="platform-course-carousel-footer">
            <span className="course-carousel-pagination" />
            <div className="platform-course-progress">
              <span />
            </div>
            <div className="platform-course-carousel-controls">
              <button className="course-carousel-prev" aria-label="Previous course">
                <ArrowLeft size={23} />
              </button>
              <button className="course-carousel-next" aria-label="Next course">
                <ArrowRight size={23} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
