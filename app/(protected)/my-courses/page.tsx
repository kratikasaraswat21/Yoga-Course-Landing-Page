import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My yoga courses",
  description: "Access your purchased Kratika Yoga courses.",
};

export default function MyCoursesRedirect() {
  redirect("/course/enrolled");
}
