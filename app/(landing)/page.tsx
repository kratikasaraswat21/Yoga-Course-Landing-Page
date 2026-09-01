import { LandingPage } from "@/components/landing-page/landing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Yoga courses for coming back to yourself",
  "Explore thoughtful yoga courses, guided practices and PDF programs designed to help you move better, breathe deeper and reconnect with yourself.",
  "/",
);

export const revalidate = 600;

export default function Page() {
  return <LandingPage />;
}
