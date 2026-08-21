import { EnvConfig } from "@/lib/config/envConfig";
import type { LandingCourse, LandingCoursesResponse } from "@/types/landing-course";

const COURSES_URL = EnvConfig.API_BASE_URL.endsWith("/app/api/v1")
  ? `${EnvConfig.API_BASE_URL}/courses`
  : `${EnvConfig.API_BASE_URL}/app/api/v1/courses`;

const fallbackCourse = (course: Partial<LandingCourse>): LandingCourse => ({
  courseId: course.courseId ?? "",
  title: course.title ?? "Untitled course",
  description: course.description ?? "No description available",
  rating: Number.isFinite(course.rating) ? Number(course.rating) : 0,
  price: Number.isFinite(course.price) ? Number(course.price) : 0,
  discount: Number.isFinite(course.discount) ? Number(course.discount) : 0,
  totalPayableAmount: Number.isFinite(course.totalPayableAmount) ? Number(course.totalPayableAmount) : 0,
  totalVideos: Number.isFinite(course.totalVideos) ? Number(course.totalVideos) : 0,
  totalHours: Number.isFinite(course.totalHours) ? Number(course.totalHours) : 0,
  totalStudents: Number.isFinite(course.totalStudents) ? Number(course.totalStudents) : 0,
  thumbnail: course.thumbnail ?? "",
});

export async function getLandingCourses(
  kind: "top-rated" | "all",
): Promise<{ courses: LandingCourse[]; error?: string }> {
  if (!EnvConfig.API_BASE_URL) return { courses: [], error: "Course service is not configured." };

  try {
    const response = await fetch(`${COURSES_URL}/${kind}`, { next: { revalidate: 600 } });
    if (!response.ok) return { courses: [], error: `Unable to load courses (${response.status}).` };
    const payload = (await response.json()) as LandingCoursesResponse;
    if (!payload.success) return { courses: [], error: "Unable to load courses right now." };
    return { courses: (payload.data?.courses ?? []).map(fallbackCourse) };
  } catch {
    return { courses: [], error: "Unable to connect to the course service." };
  }
}
