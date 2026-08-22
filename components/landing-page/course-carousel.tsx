"use client";

import { ArrowLeft, ArrowRight, Clock3, Video } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import courseFallback from "@/assets/images/landing/course/course-main.png";

import { CourseRatingStars } from "./course-rating-stars";
import type { LandingCourse } from "@/types/landing-course";

export function CourseCarousel({ courses, error }: { courses: LandingCourse[]; error?: string }) {
  const hasMultipleCourses = courses.length > 1;

  return <section className="platform-course-carousel" id="course-library">
    <div className="kratika-yoga-container">
      <div className="platform-carousel-heading"><h2>Choose the course that meets you where you are.</h2><div className="platform-carousel-heading-copy"><p>Begin with the level and focus that feel right for you. Each course includes clear guidance, structured lessons and lifetime access.</p><a className="landing-button landing-button-light" href="/courses">Explore all courses <ArrowRight size={18} /></a></div></div>
      {courses.length > 0 && <Swiper className="platform-course-swiper" modules={[Navigation, Pagination, A11y]} navigation={hasMultipleCourses ? { nextEl: ".course-carousel-next", prevEl: ".course-carousel-prev" } : false} pagination={hasMultipleCourses ? { el: ".course-carousel-pagination", type: "fraction" } : false} spaceBetween={50} slidesPerView={1}>
        {courses.slice(0, 3).map((course) => <SwiperSlide key={course.courseId}><article className="platform-course-feature-slide"><div className="platform-course-feature-image" style={{ backgroundImage: `url(${course.thumbnail || courseFallback.src})` }} /><div className="platform-course-feature-copy"><div className="platform-course-feature-title"><h3 className="line-clamp-2">{course.title}</h3></div><p className="line-clamp-4">{course.description}</p><div className="platform-course-feature-meta"><span><Video size={23} />{course.totalVideos} videos</span><span><Clock3 size={23} />{course.totalHours} hours</span></div><div className="platform-course-feature-rating"><b>{course.rating.toFixed(1)}</b><CourseRatingStars rating={course.rating} /><small>{course.totalStudents} students</small></div><div className="platform-course-feature-price"><strong>₹{course.totalPayableAmount.toLocaleString("en-IN")}</strong>{course.discount > 0 && <small>₹{course.price.toLocaleString("en-IN")} · {course.discount}% off</small>}<a className="landing-button landing-button-light" href={`/courses/${course.courseId}`}>View course <ArrowRight size={18} /></a></div></div></article></SwiperSlide>)}
      </Swiper>}
      {error && <p className="landing-course-message error">{error}</p>}
      {!error && courses.length === 0 && <p className="landing-course-message">No courses available right now.</p>}
      {hasMultipleCourses && <div className="platform-course-carousel-footer"><span className="course-carousel-pagination" /><div className="platform-course-progress"><span /></div><div className="platform-course-carousel-controls"><button className="course-carousel-prev" aria-label="Previous course"><ArrowLeft size={23} /></button><button className="course-carousel-next" aria-label="Next course"><ArrowRight size={23} /></button></div></div>}
    </div>
  </section>;
}
