"use client";

import { Check } from "lucide-react";

import { COMMON_BORDER_RADIUS } from "@/lib/constants/layout";
import { formatCurrency } from "@/lib/formatters/currency";
import { cn } from "@/lib/utils";
import { Txt, useLandingText } from "./landing-text";

/** The struck-through full price (when discounted) above the price right now. */
export function LandingPrice() {
  const { pricing } = useLandingText();
  const isDiscounted = pricing.price > pricing.payableAmount;

  return (
    <div className="lp-price-row">
      {isDiscounted && <s className="lp-price-was">{formatCurrency(pricing.price)}</s>}
      <div className="lp-amt">{formatCurrency(pricing.payableAmount)}</div>
    </div>
  );
}

/** "How it works" numbered steps inside the price card; prelaunch and live have their own steps. */
export function PricingSteps({
  title,
  steps,
}: {
  title?: string;
  steps?: { prelaunch?: string[]; live?: string[] } | null;
}) {
  const { isPrelaunch } = useLandingText();
  const items = (isPrelaunch ? steps?.prelaunch : steps?.live) ?? [];
  if (items.length === 0) return null;

  return (
    <div className={cn("lp-how", COMMON_BORDER_RADIUS)}>
      {title && (
        <p className="lp-card-label">
          <Txt text={title} />
        </p>
      )}
      <ol>
        {items.map((step, index) => (
          <li key={index}>
            <Txt text={step} />
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Ticked list of what the price includes, under the steps. */
export function PricingFeatures({ items }: { items?: string[] | null }) {
  const features = (items ?? []).filter((item) => item.trim().length > 0);
  if (features.length === 0) return null;

  return (
    <ul className="lp-price-list">
      {features.map((item, index) => (
        <li key={index}>
          <Check aria-hidden="true" size={18} strokeWidth={2.4} />
          <span>
            <Txt text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
