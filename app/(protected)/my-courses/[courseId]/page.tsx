"use client";

import { CourseDetailHero, CourseVideoSection } from "@/components/course/course-detail";
import { CourseDetailSkeleton } from "@/components/course/course-skeletons";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import type { Course, CourseDetailsResponse } from "@/types/course";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = useDebounce(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await multipleApiHandler([{ endPoint: `/courses/${courseId}`, method: "GET" }]);
      const res = response[0] as { data?: CourseDetailsResponse } | undefined;
      if (!res?.data?.success) {
        const message = res?.data?.message ?? "Course could not be loaded.";
        setError(message);
        toast.add({ title: "Course could not be loaded", description: message, type: "error" });
        return;
      }
      setCourse(res.data.data.course);
    } catch {
      const message = "Course could not be loaded. Please try again.";
      setError(message);
      toast.add({ title: "Course could not be loaded", description: message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (isLoading) return <CourseDetailSkeleton />;
  if (error || !course)
    return (
      <div className="courses-status courses-error">
        <p>{error || "Course not found."}</p>
        <button onClick={fetchCourse}>Try again</button>
      </div>
    );

  return (
    <div className="course-detail-page">
      <nav className="course-breadcrumb">
        <Link href="/my-courses">Courses</Link>
        <ChevronRight size={16} />
        <span className="capitalize!">{course.title}</span>
      </nav>
      <CourseDetailHero course={course} />
      <CourseVideoSection course={course} />
    </div>
  );
}
