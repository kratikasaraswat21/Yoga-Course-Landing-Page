import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Yoga lesson",
  description: "Practise a guided Kratika Yoga lesson and build a consistent practice at your own pace.",
};

export default function EnrolledVideoLessonLayout({ children }: { children: ReactNode }) {
  return children;
}
