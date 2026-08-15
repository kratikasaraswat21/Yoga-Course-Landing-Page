import { redirect } from "next/navigation";

export default function MyCoursesRedirect() {
  redirect("/course/enrolled");
}
