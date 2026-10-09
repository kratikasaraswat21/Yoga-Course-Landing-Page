import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";
import { PaidCourseListing } from "@/components/landing-page/paid-course-listing";
import { getLandingCourses } from "@/lib/api/landing-courses";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Online yoga courses", "Find guided online yoga courses for strength, mobility, calm and a consistent practice at your own pace.", "/courses");

export default async function CoursesPage() {
  const { courses, error } = await getLandingCourses("all");

  return (
    <div className="landing-page">
      <Navbar />
      <PaidCourseListing courses={courses} error={error} />
      <Footer />
    </div>
  );
}
