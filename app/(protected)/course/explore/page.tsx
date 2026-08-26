import { CourseListingPage } from "@/components/course/course-listing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore yoga courses",
  description: "Explore guided yoga courses designed to meet you exactly where you are today.",
};

export default function ExploreCoursesPage() {
  return <CourseListingPage mode="explore" />;
}
