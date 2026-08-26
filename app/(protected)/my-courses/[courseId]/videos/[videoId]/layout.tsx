import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga lesson",
  description: "Practise a guided Kratika Yoga lesson and build a consistent practice at your own pace.",
};

export default function VideoLessonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
