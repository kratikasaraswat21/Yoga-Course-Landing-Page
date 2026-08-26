import { PdfCourseListingPage } from "@/components/pdf-course/pdf-course-listing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore PDF yoga programs",
  description: "Find practical PDF yoga programs to support your movement, mobility and mindfulness practice.",
};

export default function ExplorePdfCoursesPage() {
  return <PdfCourseListingPage mode="explore" />;
}
