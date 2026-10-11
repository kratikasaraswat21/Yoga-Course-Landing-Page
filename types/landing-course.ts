import type { CoursePricing } from "@/types/course-landing";

export interface LandingCourse {
  courseId: string;
  /** Set when the course has a public landing page at /courses/<slug>. */
  slug?: string;
  landingPageEnabled?: boolean;
  pricing?: CoursePricing;
  title: string;
  description: string;
  rating: number;
  price: number;
  discount: number;
  totalPayableAmount: number;
  totalVideos: number;
  totalHours: number;
  totalStudents: number;
  thumbnail: string;
}

/** Public landing page when it's switched on, otherwise the existing course page. */
export const getLandingCourseHref = (course: LandingCourse) =>
  course.landingPageEnabled && course.slug ? `/courses/${course.slug}` : `/course/enrolled/${course.courseId}`;

/** Where "Enroll" / "Buy course" goes: the existing course page with its Razorpay checkout (login first if needed). */
export const getCheckoutHref = (courseId: string) =>
  `/login?returnTo=${encodeURIComponent(`/course/enrolled/${courseId}`)}`;

export const isPrelaunchPriceActive = (course: LandingCourse) => course.pricing?.offerType === "PRELAUNCH";

export interface LandingCoursesResponse {
  success: boolean;
  data?: { courses?: LandingCourse[] };
}
