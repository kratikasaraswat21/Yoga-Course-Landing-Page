import { ArrowRight, Download, Users } from "lucide-react";

import pdfFallback from "@/assets/images/landing/pdf/pdf-program-dummy.webp";
import { formatCurrency } from "@/lib/formatters/currency";
import type { LandingPdfCourse } from "@/types/landing-pdf-course";

export function PdfCourseListing({ courses, error }: { courses: LandingPdfCourse[]; error?: string }) {
  return (
    <main className="pdf-landing-page">
      <section className="pdf-landing-hero">
        <div className="kratika-yoga-container">
          <p className="platform-eyebrow">Practice off the mat</p>
          <h1>Guidance you can return to, whenever you need it.</h1>
          <p>Downloadable yoga programs and reflection journals designed to support a thoughtful practice at home.</p>
        </div>
      </section>
      <section className="pdf-landing-list-section">
        <div className="kratika-yoga-container">
          <div className="pdf-landing-list-heading">
            <h2>PDF programs for your practice.</h2>
            <span>{courses.length} programs</span>
          </div>
          {error && <p className="landing-course-message error">{error}</p>}
          {!error && courses.length === 0 && (
            <p className="landing-course-message">No PDF courses available right now.</p>
          )}
          <div className="pdf-landing-grid">
            {courses.map((course, index) => (
              <article className="pdf-landing-card" key={course.id || `${course.title}-${index}`}>
                <div
                  className="pdf-landing-card-image aspect-video"
                  style={{ backgroundImage: `url(${course.thumbnailUrl || pdfFallback.src})` }}
                />
                <div className="pdf-landing-card-content">
                  <div className="w-full">
                    <div className="pdf-landing-card-meta">
                      <span>
                        <Users size={16} />
                        {course.enrolledStudents} enrolled students
                      </span>
                      <span>
                        <Download size={16} />
                        Instant download
                      </span>
                    </div>
                    <h3 className="line-clamp-2 w-full">{course.title}</h3>
                    <div className="line-clamp-4 w-full rich-text-description" dangerouslySetInnerHTML={{ __html: course.description }} />
                  </div>
                  <div className="pdf-landing-card-footer w-full">
                    <div>
                      {course.discount > 0 && (
                        <>
                          <del>{formatCurrency(course.price)}</del>
                          <small>{course.discount}% OFF</small>
                        </>
                      )}
                      <strong>{formatCurrency(course.discount > 0 ? course.totalPayableAmount : course.price)}</strong>
                    </div>
                    <a href={`/pdf-course/${course.id}`}>
                      View program <ArrowRight size={16} />
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
