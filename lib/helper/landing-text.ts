import { formatCurrency } from "@/lib/formatters/currency";
import type { CourseLandingPage, CoursePricing } from "@/types/course-landing";

export type LandingPlaceholderValues = Record<string, string>;

const previousDay = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-14" -> "14-Oct-2026" (no spaces, so the date never splits across lines). */
const formatPlaceholderDate = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const [year, month, day] = date.split("-").map(Number);
  return `${day}-${MONTHS[month - 1]}-${year}`;
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
    launchDate: launchDate ? formatPlaceholderDate(launchDate) : "",
    // The offer stops at 12:00 AM on the end date, so its last full day is the day before.
    offerEndDate: prelaunch ? formatPlaceholderDate(previousDay(prelaunch.endDate)) : "",
    courseTitle: page.course.title,
    lessonCount: String(page.curriculum?.length ?? 0),
    totalDuration: formatTotalDuration(
      (page.curriculum ?? []).reduce((total, lesson) => total + (Number(lesson?.durationSeconds) || 0), 0),
    ),
  };
}

/** Replaces known {placeholders} (also {{placeholders}}, a common typo); unknown ones are left as typed. */
export const fillPlaceholders = (text: string, values: LandingPlaceholderValues) =>
  text.replace(/\{\{\s*(\w+)\s*\}\}|\{\s*(\w+)\s*\}/g, (match, doubleKey?: string, singleKey?: string) => {
    const key = doubleKey ?? singleKey ?? "";
    return (
      values[key] ?? values[Object.keys(values).find((name) => name.toLowerCase() === key.toLowerCase()) ?? ""] ?? match
    );
  });

/** Splits "30 Days to *Full Mobility* for ~₹3,600~ ₹1,800" into plain, highlighted and struck-through parts. */
export function splitHighlights(text: string): { text: string; highlighted: boolean; struck: boolean }[] {
  return text
    .split(/(\*[^*]+\*|~[^~]+~)/g)
    .filter(Boolean)
    .map((part) => {
      const marker = part.length > 2 && part[0] === part[part.length - 1] ? part[0] : "";
      if (marker === "*") return { text: part.slice(1, -1), highlighted: true, struck: false };
      if (marker === "~") return { text: part.slice(1, -1), highlighted: false, struck: true };
      return { text: part, highlighted: false, struck: false };
    });
}

/** Plain text for SEO and attributes: placeholders filled, highlight and strike-through markers removed. */
export const toPlainText = (text: string, values: LandingPlaceholderValues) =>
  fillPlaceholders(text, values).replace(
    /\*([^*]+)\*|~([^~]+)~/g,
    (_match, highlighted, struck) => highlighted ?? struck,
  );

export const pickPhase = <Value>(value: { prelaunch: Value; live: Value }, isPrelaunch: boolean): Value =>
  isPrelaunch ? value.prelaunch : value.live;
