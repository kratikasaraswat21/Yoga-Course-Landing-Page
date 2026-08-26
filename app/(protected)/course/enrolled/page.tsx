import { CourseListingPage } from "@/components/course/course-listing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My yoga courses",
  description: "Continue your purchased yoga courses and keep learning at your own pace.",
};

export default function EnrolledCoursesPage() {
  return <CourseListingPage mode="enrolled" />;
}
