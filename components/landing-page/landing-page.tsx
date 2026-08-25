import { AboutSection } from "./about-section";
import { HeroSection } from "./hero-section";
import { PlatformSections } from "./platform-sections";
import { getLandingCourses } from "@/lib/api/landing-courses";
import { getLandingPdfCourses } from "@/lib/api/landing-pdf-courses";

export async function LandingPage() {
  const [{ courses: topCourses, error }, { courses: topPdfCourses, error: pdfError }] = await Promise.all([
    getLandingCourses("top-rated"),
    getLandingPdfCourses("top"),
  ]);
  return (
    <main className="landing-page">
      <HeroSection />
      <AboutSection />
      <PlatformSections
        topCourses={topCourses.slice(0, 3)}
        topPdfCourses={topPdfCourses.slice(0, 5)}
        error={error}
        pdfError={pdfError}
      />
    </main>
  );
}
