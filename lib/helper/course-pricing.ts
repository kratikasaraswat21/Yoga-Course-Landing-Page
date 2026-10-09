import type { CoursePricing } from "@/types/course-landing";

/**
 * Display-only mirror of the backend pricing rules. Pages are cached, so the price shown is worked
 * out again in the browser from the prelaunch dates; checkout always charges the backend price.
 */
export function getCurrentPricing(pricing: CoursePricing, now: number): CoursePricing {
  const { prelaunch } = pricing;
  if (!prelaunch) return pricing;

  const startsAt = Date.parse(prelaunch.startsAt);
  const endsAt = Date.parse(prelaunch.endsAt);
  const state = now < startsAt ? "UPCOMING" : now < endsAt ? "LIVE" : "ENDED";
  const isActive = state === "LIVE";
  const normal = pricing.normalDiscount;

  return {
    ...pricing,
    offerType: isActive ? "PRELAUNCH" : normal.discountPercent > 0 ? "DISCOUNT" : "NONE",
    discountPercent: isActive ? prelaunch.discountPercent : normal.discountPercent,
    payableAmount: isActive ? prelaunch.payableAmount : normal.payableAmount,
    prelaunch: { ...prelaunch, state, isActive, isUpcoming: state === "UPCOMING" },
  };
}

/** "3d 04h 12m" — or "04h 12m 09s" in the last day. */
export function formatCountdown(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return days > 0 ? `${days}d ${pad(hours)}h ${pad(minutes)}m` : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}
