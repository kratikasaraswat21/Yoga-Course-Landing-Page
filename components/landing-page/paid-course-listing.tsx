import { ArrowRight, Clock3, Video } from "lucide-react";

import courseFallback from "@/assets/images/landing/course/course-main.png";
import type { LandingCourse } from "@/types/landing-course";
import { CourseRatingStars } from "./course-rating-stars";

export function PaidCourseListing({ courses, error }: { courses: LandingCourse[]; error?: string }) {
  return (
    <main className="paid-course-page">
      <section className="paid-course-hero">
        <div className="kratika-yoga-container">
          <p className="platform-eyebrow">The course library</p>
          <h1>Find a practice that grows with you.</h1>
          <p>
            Explore structured video courses designed to help you move better, breathe deeper and build a practice at
            your own pace.
          </p>
        </div>
      </section>
      <section className="paid-course-list-section">
        <div className="kratika-yoga-container">
          <div className="paid-course-list-heading">
            <h2>Guided courses for every stage.</h2>
            <span>{courses.length} courses</span>
          </div>
          {error && <p className="landing-course-message error">{error}</p>}
          {!error && courses.length === 0 && <p className="landing-course-message">No courses available right now.</p>}
          <div className="paid-course-list-grid">
            {courses.map((course) => (
              <article className="paid-course-card" key={course.courseId}>
                <div
                  className="paid-course-card-image"
                  style={{ backgroundImage: `url(${course.thumbnail || courseFallback.src})` }}
                />
                <div className="paid-course-card-content">
                  <div className="paid-course-card-rating">
                    <CourseRatingStars rating={course.rating} />
                    <strong>{course.rating.toFixed(1)}</strong>
                    <span>course rating</span>
                  </div>
                  <h3 className="line-clamp-2">{course.title}</h3>
                  <p className="line-clamp-4">{course.description}</p>
                  <div className="paid-course-card-meta">
                    <span>
                      <Video size={17} />
                      {course.totalVideos} videos
                    </span>
                    <span>
                      <Clock3 size={17} />
                      {course.totalHours} hours
                    </span>
                    <span>{course.totalStudents} students</span>
                  </div>
                  <div className="paid-course-card-footer">
                    <div>
                      <strong>₹{course.totalPayableAmount.toLocaleString("en-IN")}</strong>
                      <small>
                        ₹{course.price.toLocaleString("en-IN")} · {course.discount}% off
                      </small>
                    </div>
                    <a href={`/course/enrolled/${course.courseId}`}>
                      View course <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
