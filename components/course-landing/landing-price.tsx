"use client";

import { COMMON_BORDER_RADIUS } from "@/lib/constants/layout";
import { formatCurrency } from "@/lib/formatters/currency";
import { cn } from "@/lib/utils";
import { Txt, useLandingText } from "./landing-text";

const pad = (value: number) => String(value).padStart(2, "0");

/** The price right now; next to it the struck-through full price and the saving, when discounted. */
export function LandingPrice() {
  const { pricing } = useLandingText();
  const saving = pricing.price - pricing.payableAmount;

  return (
    <div className="lp-price-row">
      <div className="lp-amt">{formatCurrency(pricing.payableAmount)}</div>
      {saving > 0 && (
        <div className="lp-price-was">
          <s>{formatCurrency(pricing.price)}</s>
          <span>You save {formatCurrency(saving)}</span>
        </div>
      )}
    </div>
  );
}

/** "Ends in 01d 02h 17m 24s" while the prelaunch offer runs. */
export function PriceCountdown() {
  const { isPrelaunch, pricing, now } = useLandingText();
  if (!isPrelaunch || !pricing.prelaunch) return null;

  const remaining = now === null ? null : Math.max(0, Date.parse(pricing.prelaunch.endsAt) - now);
  const parts = [
    { unit: "d", value: remaining === null ? null : Math.floor(remaining / 86_400_000) },
    { unit: "h", value: remaining === null ? null : Math.floor((remaining % 86_400_000) / 3_600_000) },
    { unit: "m", value: remaining === null ? null : Math.floor((remaining % 3_600_000) / 60_000) },
    { unit: "s", value: remaining === null ? null : Math.floor((remaining % 60_000) / 1000) },
  ];

  return (
    <div className="lp-price-count" aria-live="off">
      <span>Ends in</span>
      {parts.map(({ unit, value }) => (
        <b key={unit}>
          {value === null ? "––" : pad(value)}
          {unit}
        </b>
      ))}
    </div>
  );
}

/** "How it works" steps in a row inside the price card; prelaunch and live have their own steps. */
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
            <span>{index + 1}</span>
            <p>
              <Txt text={step} />
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
