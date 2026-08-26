import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My yoga course",
  description: "Continue practising your purchased Kratika Yoga course and watch guided lessons.",
};

export default function MyCourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
