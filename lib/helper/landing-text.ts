import { formatCurrency } from "@/lib/formatters/currency";
import { formatScheduleDate } from "@/lib/helper/schedule-date";
import type { CourseLandingPage, CoursePricing } from "@/types/course-landing";

export type LandingPlaceholderValues = Record<string, string>;

const previousDay = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
};

/** "1h 32m", "45m" or "1h" (with a non-breaking space, so it never splits across lines). */
export const formatTotalDuration = (seconds: number) => {
  const minutes = Math.round(Math.max(0, seconds) / 60);
  const hours = Math.floor(minutes / 60);
  if (hours === 0) return `${minutes}m`;
  return minutes % 60 === 0 ? `${hours}h` : `${hours}h\u00a0${minutes % 60}m`;
};

/**
 * Values for {price}, {originalPrice}, {discount}, {launchDate}, {offerEndDate}, {courseTitle},
 * {lessonCount} and {totalDuration}.
 */
export function getPlaceholderValues(page: CourseLandingPage, pricing: CoursePricing): LandingPlaceholderValues {
  const { prelaunch } = pricing;
  // The course opens when its first lesson unlocks; without scheduled lessons, when the prelaunch ends.
  const launchDate = page.stats.upcomingReleaseDate ?? prelaunch?.endDate ?? null;

  return {
    price: formatCurrency(pricing.payableAmount),
    originalPrice: formatCurrency(pricing.price),
    discount: String(pricing.discountPercent),
    launchDate: launchDate ? formatScheduleDate(launchDate, true) : "",
    // The offer stops at 12:00 AM on the end date, so its last full day is the day before.
    offerEndDate: prelaunch ? formatScheduleDate(previousDay(prelaunch.endDate), true) : "",
    courseTitle: page.course.title,
    lessonCount: String(page.curriculum?.length ?? 0),
    totalDuration: formatTotalDuration(
      (page.curriculum ?? []).reduce((total, lesson) => total + (Number(lesson?.durationSeconds) || 0), 0),
    ),
  };
}

/** Replaces known {placeholders}; unknown ones are left as typed. */
export const fillPlaceholders = (text: string, values: LandingPlaceholderValues) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/** Splits "30 Days to *Full Mobility*" into plain and highlighted parts. */
export function splitHighlights(text: string): { text: string; highlighted: boolean }[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), highlighted: true }
        : { text: part, highlighted: false },
    );
}

/** Plain text for SEO and attributes: placeholders filled, highlight markers removed. */
export const toPlainText = (text: string, values: LandingPlaceholderValues) =>
  fillPlaceholders(text, values).replace(/\*([^*]+)\*/g, "$1");

export const pickPhase = <Value>(value: { prelaunch: Value; live: Value }, isPrelaunch: boolean): Value =>
  isPrelaunch ? value.prelaunch : value.live;
