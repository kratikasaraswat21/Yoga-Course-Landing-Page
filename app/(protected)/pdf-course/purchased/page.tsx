import { PdfCourseListingPage } from "@/components/pdf-course/pdf-course-listing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My PDF yoga programs",
  description: "Open and use the PDF yoga programs you have purchased from Kratika Yoga.",
};

export default function PurchasedPdfCoursesPage() {
  return <PdfCourseListingPage mode="purchased" />;
}
