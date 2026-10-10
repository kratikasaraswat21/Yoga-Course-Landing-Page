"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CourseCard } from "@/components/landing-page/course-card";
import { BOOK_A_CALL_URL } from "@/lib/constants/links";
import type { LandingCourse } from "@/types/landing-course";


// Courses shown at first, and how many more each "Load more courses" click adds.
const COURSES_PER_PAGE = 6;

/**
 * Home page course cards in a grid: 3 per row on desktop, 2 on tablets, 1 on phones.
 * The first 6 show; "Load more courses" adds 6 more at a time until all are shown.
 */
export function CourseCarousel({ courses, error }: { courses: LandingCourse[]; error?: string }) {
  const [visibleCount, setVisibleCount] = useState(COURSES_PER_PAGE);
  const visibleCourses = courses.slice(0, visibleCount);
  const hasMore = courses.length > visibleCount;

  return (
    <section className="platform-course-carousel" id="course-library">
      <div className="kratika-yoga-container">
        <div className="platform-carousel-heading">
          <h2>Choose the course that meets you where you are.</h2>
          <div className="platform-carousel-heading-copy">
            <p className="text-justify">
              Begin with the level and focus that feel right for you. Each course includes clear guidance, structured
              lessons and lifetime access.
            </p>
            <Link className="landing-button landing-button-light" href="/courses">
              Explore all courses <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {courses.length > 0 && (
          <div className="home-courses">
            <div className="home-courses-grid">
              {visibleCourses.map((course) => (
                <CourseCard course={course} key={course.courseId} />
              ))}
            </div>
            {hasMore && (
              <div className="home-courses-more">
                <button
                  className="landing-button landing-button-light"
                  type="button"
                  onClick={() => setVisibleCount((count) => count + COURSES_PER_PAGE)}>
                  Load more courses <ChevronDown size={18} />
                </button>
              </div>
            )}
          </div>
        )}
        {error && <p className="landing-course-message error">{error}</p>}
        {!error && courses.length === 0 && <p className="landing-course-message">No courses available right now.</p>}

        <div className="home-consultation">
          <div>
            <p className="home-consultation-eyebrow">Not sure where to begin?</p>
            <h3>Talk to Kratika before you choose.</h3>
            <p>
              Book a one-on-one consultation. Share your experience, goals and any health considerations, and Kratika will
              recommend the course that fits you best.
            </p>
          </div>
          <a className="landing-button landing-button-light" href={BOOK_A_CALL_URL} target="_blank" rel="noopener noreferrer">
            Book a consultation <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
