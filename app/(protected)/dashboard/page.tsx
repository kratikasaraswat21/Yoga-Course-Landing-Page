"use client";

import dashboardWelcomeBanner from "@/assets/images/dashboard-welcome-banner.webp";
import { CourseCard, ExploreRow, PdfCard, ProductCard } from "@/components/course/course-card";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { useDashboardSession } from "@/components/layout/dashboard-session";
import { SectionContainer } from "@/components/layout/section-container";
import { LibraryEmptyState } from "@/components/shared/library-empty-state";
import { toast } from "@/components/ui/toast";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { getTimeGreeting } from "@/lib/helper/time";
import type { AffiliateProduct, AffiliateProductsResponse } from "@/types/affiliate-product";
import type { ApiCourse, CoursesResponse } from "@/types/course";
import type { PdfCourse, PdfCoursesResponse } from "@/types/pdf-course";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const user = useDashboardSession();
  const [purchasedCourses, setPurchasedCourses] = useState<ApiCourse[]>([]);
  const [exploreCourses, setExploreCourses] = useState<ApiCourse[]>([]);
  const [pdfCourses, setPdfCourses] = useState<PdfCourse[]>([]);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const responses = await multipleApiHandler([
          { endPoint: "/courses/my-courses", method: "GET", protected: true },
          { endPoint: "/courses", method: "GET", protected: true },
          { endPoint: "/pdf-courses/purchased", method: "GET", protected: true },
          { endPoint: "/affiliate-products", method: "GET" },
        ]);
        const purchased = responses[0]?.data as CoursesResponse | undefined;
        const explore = responses[1]?.data as CoursesResponse | undefined;
        const pdf = responses[2]?.data as PdfCoursesResponse | undefined;
        const affiliate = responses[3]?.data as AffiliateProductsResponse | undefined;

        if (purchased?.success) setPurchasedCourses(purchased.data?.courses ?? []);
        if (explore?.success) setExploreCourses(explore.data?.courses ?? []);
        if (pdf?.success) setPdfCourses(pdf.data?.pdfCourses ?? []);
        if (affiliate?.success) setProducts((affiliate.data?.products ?? []).sort((a, b) => a.sortOrder - b.sortOrder));
        if (![purchased, explore, pdf, affiliate].some((result) => result?.success)) {
          toast.add({
            title: "Dashboard data could not be loaded",
            description: "Please refresh and try again.",
            type: "error",
          });
        }
      } catch {
        toast.add({
          title: "Dashboard data could not be loaded",
          description: "Please refresh and try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    void fetchDashboardData();
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  const courses = purchasedCourses.slice(0, 2).map((course) => {
    const completed = course.completedVideoCount ?? course.completedLessons ?? course.completed ?? 0;
    const lessons = course.videoCount ?? 0;
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      lessons: String(lessons),
      completed: String(completed),
      progress: course.progress ?? (lessons ? Math.round((completed / lessons) * 100) : 0),
      href: `/course/enrolled/${course.id}`,
    };
  });
  const exploreRows = exploreCourses.slice(0, 2).map((course) => ({
    title: course.title,
    lessons: String(course.videoCount),
    basePrice: course.discount && course.discount > 0 ? `₹${course.price.toLocaleString("en-IN")}` : "",
    discount: course.discount ? `${course.discount}%` : "",
    price: `₹${(course.discount && course.discount > 0 ? course.totalPayableAmount : course.price).toLocaleString("en-IN")}`,
    href: `/course/enrolled/${course.id}`,
  }));
  const pdfCards = pdfCourses.slice(0, 2).map((pdf, index) => ({
    title: pdf.title,
    imageUrl: pdf.thumbnailUrl,
    kind: pdf.purchaseType === "FREE" ? "Free guide" : "PDF course",
    pages: "",
    tone: index % 2 === 0 ? ("clay" as const) : ("sage" as const),
    href: `/pdf-course/${pdf.id}`,
  }));

  return (
    <>
      <SectionContainer className="welcome-card">
        <div className="welcome-copy">
          <h1>
            {getTimeGreeting()}, {user?.name ?? "there"}
          </h1>
          <p>
            Welcome back. Continue your practice and
            <br className="desktop-only" /> take one mindful step today.
          </p>
        </div>
        <div className="welcome-image">
          <Image
            src={dashboardWelcomeBanner}
            alt="Woman meditating in a warm, sunlit yoga studio"
            fill
            priority
            sizes="(max-width: 600px) 100vw, 52vw"
          />
        </div>
      </SectionContainer>
      <div className="dashboard-grid top-grid">
        <SectionContainer className="panel continue-panel">
          <div className="panel-heading">
            <h2>Continue learning</h2>
            <Link href="/course/enrolled">
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
          {exploreRows.length ? (
            <>
              <div className="explore-list">
                {exploreRows.map((course) => (
                  <ExploreRow {...course} key={course.title} />
                ))}
              </div>
              <div className="carousel-dots">
                <b />
                <i />
                <i />
              </div>
            </>
          ) : (
            <LibraryEmptyState
              type="courses"
              title="No courses available"
              description="New guided practices will appear here soon."
              buttonHref="/course/explore"
              buttonLabel="Explore courses"
              showBorder={false}
            />
          )}
        </SectionContainer>
      </div>
      <div className="dashboard-grid bottom-grid">
        <SectionContainer className="panel pdf-panel" id="pdf-courses">
          <div className="panel-heading">
            <h2>Your PDF courses</h2>
            <Link href="/pdf-course/explore">
              View all PDFs <ChevronRight size={17} />
            </Link>
          </div>
          {pdfCards.length ? (
            <div className="pdf-grid">
              {pdfCards.map((pdf) => (
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
            <Link href="/affiliate-products" className="panel-heading-link">
              View all <ChevronRight size={17} />
            </Link>
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
            {products.slice(0, 2).map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                description={product.description}
                href={product.productsLink}
                buttonTitle={product.buttonTitle}
              />
            ))}
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
