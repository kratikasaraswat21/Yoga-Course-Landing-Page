"use client";

import { BookOpen, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CourseListingSkeleton } from "@/components/course/course-skeletons";
import { LibraryEmptyState } from "@/components/shared/library-empty-state";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import type { ApiCourse, CoursesResponse } from "@/types/course";

const fallbackImage = "/images/auth/login-yoga.png";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = useDebounce(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await multipleApiHandler([
        {
          endPoint: "/courses",
          method: "GET",
        },
      ]);
      const res = response[0] as { data?: CoursesResponse } | undefined;

      if (!res?.data?.success) {
        const message = res?.data?.message ?? "Courses could not be loaded.";
        setError(message);
        toast.add({ title: "Courses could not be loaded", description: message, type: "error" });
        return;
      }

      setCourses(res.data.data?.courses ?? []);
    } catch {
      const message = "Courses could not be loaded. Please try again.";
      setError(message);
      toast.add({ title: "Courses could not be loaded", description: message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const visibleCourses = courses.filter((course) => {
    const query = search.trim().toLowerCase();
    return !query || `${course.title} ${course.description}`.toLowerCase().includes(query);
  });

  if (isLoading) return <CourseListingSkeleton />;

  return (
    <div className="courses-page">
      <div className="courses-hero">
        <div>
          <span className="eyebrow">YOUR PRACTICE, YOUR PACE</span>
          <h1>Explore courses</h1>
          <p>Find a thoughtful practice to meet you exactly where you are today.</p>
        </div>
        <div className="courses-hero-art">
          <BookOpen size={54} strokeWidth={1} />
        </div>
      </div>

      <label className="local-course-search">
        <Search size={18} />
        <span className="sr-only">Search courses</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your courses" />
      </label>

      {error ? (
        <div className="courses-status courses-error">
          <p>{error}</p>
          <button onClick={fetchCourses}>Try again</button>
        </div>
      ) : visibleCourses.length ? (
        <div className="catalog-grid">
          {visibleCourses.map((course) => (
            <article className="catalog-card" key={course.id}>
              <div className="catalog-image">
                <Image
                  src={course.thumbnailUrl || fallbackImage}
                  alt={course.title}
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
                <span>{course.videoCount} videos</span>
              </div>
              <div className="catalog-card-copy">
                <div className="catalog-meta">
                  <span>Yoga course</span>
                  <span>{course.videoCount} videos</span>
                </div>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className="catalog-bottom">
                  <strong>₹{course.price.toLocaleString("en-IN")}</strong>
                  {course.totalPayableAmount > course.price && (
                    <del>₹{course.totalPayableAmount.toLocaleString("en-IN")}</del>
                  )}
                  <Link className="catalog-button" href={`/my-courses/${course.id}`}>
                    View course
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <LibraryEmptyState
          type="courses"
          title={search ? "No courses found" : undefined}
          description={search ? "Try a different search." : undefined}
          showButton={!search}
          showBorder={false}
        />
      )}
    </div>
  );
}
