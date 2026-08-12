"use client";

import { CourseCard, ExploreRow, PdfCard, ProductCard } from "@/components/course/course-card";
import { SectionContainer } from "@/components/layout/section-container";
import { LibraryEmptyState } from "@/components/shared/library-empty-state";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const courses = [
  {
    title: "Foundations of Hatha Yoga",
    description: "Build strength, balance, and mindful movement.",
    lessons: "18",
    completed: "12",
    progress: 68,
    imagePosition: "58% center",
  },
  {
    title: "Mindful Pranayama",
    description: "Discover calming breathwork for everyday practice.",
    lessons: "14",
    completed: "5",
    progress: 35,
    imagePosition: "78% center",
  },
];
const pdfCourses = [
  { title: "21-Day Mindfulness Journal", kind: "Workbook", pages: "42 pages", tone: "clay" as const },
  { title: "Pranayama Practice Guide", kind: "Practice guide", pages: "28 pages", tone: "sage" as const },
];

export default function DashboardPage() {
  return (
    <>
      <SectionContainer className="welcome-card">
        <div className="welcome-copy">
          <h1>Good morning, Varun</h1>
          <p>
            Welcome back. Continue your practice and
            <br className="desktop-only" /> take one mindful step today.
          </p>
        </div>
        <div className="welcome-image">
          <Image
            src="/images/dashboard/dashboard-welcome-banner.png"
            alt="Woman meditating in a warm, sunlit yoga studio"
            priority
            width={1500}
            height={150}
          />
        </div>
      </SectionContainer>
      <div className="dashboard-grid top-grid">
        <SectionContainer className="panel continue-panel">
          <div className="panel-heading">
            <h2>Continue learning</h2>
            <Link href="/my-courses">
              View all <ChevronRight size={17} />
            </Link>
          </div>
          {courses.length ? (
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard course={course} key={course.title} />
              ))}
            </div>
          ) : (
            <LibraryEmptyState type="courses" />
          )}
        </SectionContainer>
        <SectionContainer className="panel explore-panel">
          <div className="panel-heading">
            <h2>Explore courses</h2>
            <div className="carousel-actions">
              <button aria-label="Previous">
                <ChevronLeft size={18} />
              </button>
              <button aria-label="Next">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="explore-list">
            <ExploreRow
              title="Yoga for Better Sleep"
              lessons="8"
              basePrice="₹1,899"
              discount="21%"
              price="₹1,499"
              imagePosition="35% center"
            />
            <ExploreRow
              title="Morning Energy Flow"
              lessons="10"
              basePrice="₹1,599"
              discount="19%"
              price="₹1,299"
              imagePosition="60% center"
            />
          </div>
          <div className="carousel-dots">
            <b />
            <i />
            <i />
          </div>
        </SectionContainer>
      </div>
      <div className="dashboard-grid bottom-grid">
        <SectionContainer className="panel pdf-panel" id="pdf-courses">
          <div className="panel-heading">
            <h2>Your PDF courses</h2>
            <Link href="#pdf-courses">
              View all PDFs <ChevronRight size={17} />
            </Link>
          </div>
          {pdfCourses.length ? (
            <div className="pdf-grid">
              {pdfCourses.map((pdf) => (
                <PdfCard {...pdf} key={pdf.title} />
              ))}
            </div>
          ) : (
            <LibraryEmptyState type="pdfs" />
          )}
        </SectionContainer>
        <SectionContainer className="panel product-panel" id="affiliate-products">
          <div className="panel-heading">
            <div>
              <h2>Recommended for your practice</h2>
              <p>Thoughtfully selected products to support your yoga journey.</p>
            </div>
            <div className="carousel-actions">
              <button aria-label="Previous">
                <ChevronLeft size={18} />
              </button>
              <button aria-label="Next">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="product-grid">
            <ProductCard title="Natural Cork Yoga Mat" imagePosition="20% center" />
            <ProductCard title="Meditation Cushion" imagePosition="82% center" />
          </div>
          <div className="carousel-dots">
            <b />
            <i />
            <i />
          </div>
        </SectionContainer>
      </div>
    </>
  );
}
