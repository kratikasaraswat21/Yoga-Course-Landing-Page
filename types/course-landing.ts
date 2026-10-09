export type OfferType = "NONE" | "DISCOUNT" | "PRELAUNCH";

export interface CoursePrelaunch {
  state: "UPCOMING" | "LIVE" | "ENDED";
  isActive: boolean;
  isUpcoming: boolean;
  /** ISO instant of 12:00 AM IST on the start date. */
  startsAt: string;
  /** ISO instant of 12:00 AM IST on the end date (the offer stops at this moment). */
  endsAt: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  payableAmount: number;
}

/** Course price as worked out by the backend at the moment the data was fetched. */
export interface CoursePricing {
  price: number;
  offerType: OfferType;
  discountPercent: number;
  payableAmount: number;
  prelaunch: CoursePrelaunch | null;
  normalDiscount: { discountPercent: number; payableAmount: number };
}

/** A text with a version for the prelaunch phase and one for after launch. */
export interface PhaseText {
  prelaunch: string;
  live: string;
}

export interface LandingIconItem {
  icon: string;
  title: string;
  text: string;
}

/**
 * Every editable section of the page (set in the admin panel). Texts may contain placeholders such
 * as {price} and *highlighted words*; see lib/helper/landing-text.ts.
 */
export interface CourseLandingContent {
  announcement: PhaseText;
  hero: {
    badge: PhaseText;
    title: string;
    subtitle: string;
    countdownLabel: string;
    primaryButton: string;
    secondaryButton: string;
    chips: string[];
    coverImageUrl: string;
    coverImageId: string;
  };
  /** Section under the hero with the course trailer. */
  trailerSection: { eyebrow: string; title: string; text: string };
  stats: LandingIconItem[];
  painPoints: { eyebrow: string; title: string; items: LandingIconItem[] };
  howItWorks: { eyebrow: string; title: string; steps: { title: string; text: string }[] };
  benefits: { eyebrow: string; title: string; text: string; items: string[] };
  curriculum: { eyebrow: string; title: string; text: string };
  pricing: {
    eyebrow: string;
    title: string;
    /** Line under the title; differs before and after launch. */
    text: PhaseText;
    badge: PhaseText;
    stepsTitle: string;
    steps: { prelaunch: string[]; live: string[] };
    includes: string[];
    button: string;
    /** Line under the price. */
    note: string;
  };
  instructor: {
    eyebrow: string;
    title: string;
    bio: string;
    imageUrl: string;
    imageId: string;
    /** Small figures under the bio, e.g. { value: "8 yrs", label: "of practice" }. */
    stats: { value: string; label: string }[];
  };
  testimonials: { eyebrow: string; title: string; showScreenshots: boolean; quotes: { text: string; name: string }[] };
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
  finalCta: { title: string; text: string; button: string };
  mobileBar: { subtitle: string };
}

/** Public course trailer (Cloudflare Stream), present only once it's ready to play. */
export interface CourseTrailer {
  hlsUrl: string;
  posterUrl: string | null;
  durationSeconds: number | null;
}

export interface CourseCurriculumItem {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string;
  durationSeconds: number;
  sortOrder: number;
  lessonNumber: number;
  isUpcoming: boolean;
  releaseAt: string | null;
  releaseDate: string | null;
  groupId?: string | null;
}

/** A week/group of lessons. `id` is null for "Other videos" (lessons without a group). */
export interface CourseCurriculumGroup {
  id: string | null;
  title: string;
  description: string | null;
  videoCount: number;
  totalDurationSeconds: number;
  videos: CourseCurriculumItem[];
}

export interface CourseLandingReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export interface CourseLandingPage {
  course: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    thumbnailUrl: string;
    updatedAt: string;
    /** Buyers complete each video before the next one opens. */
    sequentialUnlock?: boolean;
  };
  pricing: CoursePricing;
  content: CourseLandingContent;
  trailer: CourseTrailer | null;
  curriculum: CourseCurriculumItem[];
  /** Weeks/groups; empty when the course doesn't group its videos (show `curriculum` as one list). */
  groups: CourseCurriculumGroup[];
  stats: {
    videoCount: number;
    totalDurationSeconds: number;
    totalStudents: number;
    averageRating: number;
    totalReviews: number;
    upcomingReleaseAt: string | null;
    upcomingReleaseDate: string | null;
  };
  reviews: CourseLandingReview[];
}

export interface CourseLandingSlug {
  slug: string;
  courseId: string;
  updatedAt: string;
}
