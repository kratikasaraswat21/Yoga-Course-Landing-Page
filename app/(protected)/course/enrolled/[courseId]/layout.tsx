import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga course",
  description: "View course details, practise guided lessons and continue your Kratika Yoga journey.",
};

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
