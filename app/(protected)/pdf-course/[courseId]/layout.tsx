import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF yoga program",
  description: "View a Kratika Yoga PDF program and access your guided practice materials.",
};

export default function PdfCourseDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
