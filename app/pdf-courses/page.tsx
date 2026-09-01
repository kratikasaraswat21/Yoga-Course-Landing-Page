import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";
import { PdfCourseListing } from "@/components/landing-page/pdf-course-listing";
import { getLandingPdfCourses } from "@/lib/api/landing-pdf-courses";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("PDF yoga programs", "Browse practical PDF yoga programs from Kratika Yoga to support your practice wherever you are.", "/pdf-courses");

export const revalidate = 600;

export default async function PdfCoursesPage() {
  const { courses, error } = await getLandingPdfCourses("all");

  return <div className="landing-page"><Navbar /><PdfCourseListing courses={courses} error={error} /><Footer /></div>;
}
