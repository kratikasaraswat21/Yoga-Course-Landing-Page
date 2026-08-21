import { EnvConfig } from "@/lib/config/envConfig";
import type { LandingPdfCourse, LandingPdfCoursesResponse } from "@/types/landing-pdf-course";

const PDF_COURSES_URL = EnvConfig.API_BASE_URL.endsWith("/app/api/v1")
  ? `${EnvConfig.API_BASE_URL}/pdf-courses`
  : `${EnvConfig.API_BASE_URL}/app/api/v1/pdf-courses`;

const fallbackPdfCourse = (course: Partial<LandingPdfCourse>): LandingPdfCourse => ({
  id: course.id ?? "",
  thumbnailUrl: course.thumbnailUrl ?? "",
  price: Number.isFinite(course.price) ? Number(course.price) : 0,
  discount: Number.isFinite(course.discount) ? Number(course.discount) : 0,
  totalPayableAmount: Number.isFinite(course.totalPayableAmount) ? Number(course.totalPayableAmount) : 0,
  title: course.title ?? "Untitled PDF course",
  description: course.description ?? "No description available",
  enrolledStudents: Number.isFinite(course.enrolledStudents) ? Number(course.enrolledStudents) : 0,
});

export async function getLandingPdfCourses(
  kind: "top" | "all",
): Promise<{ courses: LandingPdfCourse[]; error?: string }> {
  if (!EnvConfig.API_BASE_URL) return { courses: [], error: "PDF course service is not configured." };

  try {
    const response = await fetch(`${PDF_COURSES_URL}/${kind}`, { next: { revalidate: 600 } });
    if (!response.ok) return { courses: [], error: `Unable to load PDF courses (${response.status}).` };

    const payload = (await response.json()) as LandingPdfCoursesResponse;
    if (!payload.success) return { courses: [], error: "Unable to load PDF courses right now." };

    return { courses: (payload.data?.pdfCourses ?? []).map(fallbackPdfCourse) };
  } catch {
    return { courses: [], error: "Unable to connect to the PDF course service." };
  }
}
