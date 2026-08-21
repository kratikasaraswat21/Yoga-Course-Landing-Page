"use client";

import { BookOpen, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PdfCourseListingSkeleton } from "@/components/pdf-course/pdf-course-listing-skeleton";
import { loginYoga } from "@/assets/image-assets";
import { LibraryEmptyState } from "@/components/shared/library-empty-state";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import type { PdfCourse, PdfCoursesResponse } from "@/types/pdf-course";

const fallbackImage = loginYoga;

export function PdfCourseListingPage({ mode }: { mode: "explore" | "purchased" }) {
  const isPurchasedList = mode === "purchased";
  const [courses, setCourses] = useState<PdfCourse[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = useDebounce(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await multipleApiHandler([
        { endPoint: isPurchasedList ? "/pdf-courses/purchased" : "/pdf-courses/explore", method: "GET", protected: true },
      ]);
      const result = response[0]?.data as PdfCoursesResponse | undefined;
      if (!response[0]?.ok || !result?.success) {
        throw new Error(result?.message ?? "PDF courses could not be loaded.");
      }
      setCourses(result.data?.pdfCourses ?? []);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "PDF courses could not be loaded.";
      setError(message);
      toast.add({ title: "PDF courses could not be loaded", description: message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const visibleCourses = courses.filter((course) => {
    const query = search.trim().toLowerCase();
    return !query || `${course.title} ${course.description ?? ""}`.toLowerCase().includes(query);
  });

  if (isLoading) return <PdfCourseListingSkeleton />;

  return (
    <div className="courses-page">
      <div className="courses-hero">
        <div>
          <span className="eyebrow">PRACTICE, REFLECT, GROW</span>
          <h1>{isPurchasedList ? "My PDF courses" : "Explore PDF courses"}</h1>
          <p>{isPurchasedList ? "Keep your practice resources close at hand." : "Find thoughtful guides to support your yoga journey."}</p>
        </div>
        <div className="courses-hero-actions">
          <Link className="courses-switch-link" href={isPurchasedList ? "/pdf-course/explore" : "/pdf-course/purchased"}>
            {isPurchasedList ? "Explore PDFs" : "My PDFs"}
          </Link>
          <div className="courses-hero-art"><BookOpen size={54} strokeWidth={1} /></div>
        </div>
      </div>

      <label className="local-course-search">
        <Search size={18} />
        <span className="sr-only">Search PDF courses</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search PDF courses" />
      </label>

      {error ? (
        <div className="courses-status courses-error"><p>{error}</p><button onClick={fetchCourses}>Try again</button></div>
      ) : visibleCourses.length ? (
        <div className="catalog-grid">
          {visibleCourses.map((course) => (
            <article className="catalog-card" key={course.id}>
              <div className="catalog-image">
                <Image src={course.thumbnailUrl || fallbackImage} alt={course.title} fill sizes="(max-width: 700px) 100vw, 33vw" />
                {course.isAvailableForFree && <span>Free</span>}
              </div>
              <div className="catalog-card-copy">
                <h2 className="title-case">{course.title}</h2>
                <p>{course.description}</p>
                <div className="catalog-bottom">
                  {!course.isAvailableForFree && (isPurchasedList ? <strong>Purchased</strong> : <><strong>₹{(course.totalPayableAmount ?? course.price ?? 0).toLocaleString("en-IN")}</strong>{(course.discount ?? 0) > 0 && <del>₹{(course.price ?? 0).toLocaleString("en-IN")}</del>}</>)}
                  <Link className="catalog-button" href={`/pdf-course/${course.id}`}>{isPurchasedList ? "Open PDF" : course.isAvailableForFree ? "Get PDF" : "View course"}</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <LibraryEmptyState
          type="pdfs"
          title={search ? "No PDF courses found" : isPurchasedList ? "No PDF courses yet" : "No PDF courses available"}
          description={search ? "Try a different search." : isPurchasedList ? "Purchase a guide and it will appear here." : "Check back soon for new practice resources."}
          showButton
          buttonHref={isPurchasedList ? "/pdf-course/explore" : "/pdf-course/purchased"}
          buttonLabel={isPurchasedList ? "Explore PDF courses" : "My PDF courses"}
        />
      )}
    </div>
  );
}
