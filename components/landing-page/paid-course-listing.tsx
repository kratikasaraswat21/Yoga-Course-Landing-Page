import type { LandingCourse } from "@/types/landing-course";
import { CourseCard } from "./course-card";

export function PaidCourseListing({ courses, error }: { courses: LandingCourse[]; error?: string }) {
  return (
    <main className="paid-course-page">
      <section className="paid-course-hero">
        <div className="kratika-yoga-container">
          <p className="platform-eyebrow">The course library</p>
          <h1>Find a practice that grows with you.</h1>
          <p className="text-justify">
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
              <CourseCard course={course} key={course.courseId} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
