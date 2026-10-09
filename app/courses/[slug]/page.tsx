import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MobileEnrollBar } from "@/components/course-landing/landing-price";
import {
  LandingAnnouncement,
  LandingBenefits,
  LandingCurriculum,
  LandingFaq,
  LandingFinalCta,
  LandingHero,
  LandingHowItWorks,
  LandingInstructor,
  LandingNav,
  LandingPainPoints,
  LandingPricing,
  LandingTestimonials,
  LandingTrailer,
} from "@/components/course-landing/landing-sections";
import { LandingTextProvider } from "@/components/course-landing/landing-text";
import { getFeedbackImages } from "@/components/landing-page/feedback-images";
import { Footer } from "@/components/landing-page/footer";
import { RevealOnScroll } from "@/components/course-landing/reveal-on-scroll";
import { getCourseLandingPage, getCourseLandingSlugs } from "@/lib/api/course-landing";
import { getPlaceholderValues, toPlainText } from "@/lib/helper/landing-text";
import { metaImage, siteUrl } from "@/lib/seo";

// Every course with its landing page switched on is built ahead of time. A course switched on later
// is rendered on its first visit and then cached. Pages are refreshed when the backend says the data
// changed (see app/api/revalidate), not on a timer.
export const dynamicParams = true;

export async function generateStaticParams() {
  const courses = await getCourseLandingSlugs();
  return courses.map(({ slug }) => ({ slug }));
}

const stripHtml = (html: string | null) =>
  (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Fraunces (headings) and Inter (text), as in the course page design. Loaded only on this page.
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCourseLandingPage(slug);
  if (!page) return { title: "Course not found", robots: { index: false } };

  const values = getPlaceholderValues(page, page.pricing);
  const description = (
    toPlainText(page.content?.hero?.subtitle ?? "", values) || stripHtml(page.course?.description ?? null)
  ).slice(0, 160);
  const image = page.content?.hero?.coverImageUrl || page.trailer?.posterUrl || page.course?.thumbnailUrl || metaImage;
  const url = `${siteUrl}/courses/${page.course.slug}`;

  return {
    title: page.course.title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: page.course.title, description, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title: page.course.title, description, images: [image] },
  };
}

export default async function CourseLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getCourseLandingPage(slug);
  if (!page) notFound();

  const { course, content, pricing, stats } = page;
  const feedbackImages = content?.testimonials?.showScreenshots ? await getFeedbackImages() : [];
  const values = getPlaceholderValues(page, pricing);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: (toPlainText(content?.hero?.subtitle ?? "", values) || stripHtml(course?.description ?? null)).slice(
      0,
      300,
    ),
    url: `${siteUrl}/courses/${course.slug}`,
    provider: { "@type": "Organization", name: "Kratika Yoga", sameAs: siteUrl },
    offers: { "@type": "Offer", category: "Paid", price: pricing.payableAmount, priceCurrency: "INR" },
    ...(stats.totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: stats.averageRating,
            reviewCount: stats.totalReviews,
          },
        }
      : {}),
  };

  return (
    <LandingTextProvider page={page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href={FONTS_URL} precedence="default" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <div className="lp">
        <LandingAnnouncement page={page} />
        <LandingNav page={page} />
        <main>
          <LandingHero page={page} />
          <LandingTrailer page={page} />
          <LandingPainPoints page={page} />
          <LandingHowItWorks page={page} />
          <LandingBenefits page={page} />
          <LandingCurriculum page={page} />
          <LandingPricing page={page} />
          <LandingInstructor page={page} />
          <LandingTestimonials feedbackImages={feedbackImages} page={page} />
          <LandingFaq page={page} />
          <LandingFinalCta page={page} />
        </main>
        <Footer />
        <MobileEnrollBar courseTitle={course?.title} subtitle={content?.mobileBar?.subtitle} />
        <RevealOnScroll />
      </div>
    </LandingTextProvider>
  );
}
