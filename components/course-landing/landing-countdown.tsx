"use client";

import { Txt, useLandingText } from "./landing-text";

const pad = (value: number) => String(value);

/** Days / hours / minutes / seconds until the prelaunch offer ends. Shown only during the prelaunch. */
export function LandingCountdown({ label }: { label: string }) {
  const { isPrelaunch, pricing, now } = useLandingText();
  if (!isPrelaunch || !pricing.prelaunch) return null;

  const remaining = now === null ? null : Math.max(0, Date.parse(pricing.prelaunch.endsAt) - now);
  const parts =
    remaining === null
      ? null
      : [
          { value: Math.floor(remaining / 86_400_000), unit: "Days" },
          { value: Math.floor((remaining % 86_400_000) / 3_600_000), unit: "Hrs" },
          { value: Math.floor((remaining % 3_600_000) / 60_000), unit: "Min" },
          { value: Math.floor((remaining % 60_000) / 1000), unit: "Sec" },
        ];

  return (
    <div className="lp-countdown" aria-live="off">
      {label && (
        <p className="lp-count-label">
          <Txt text={label} />
        </p>
      )}
      <div className="lp-count">
        {(parts ?? ["Days", "Hrs", "Min", "Sec"].map((unit) => ({ value: null, unit }))).map(({ value, unit }) => (
          <div key={unit}>
            <strong>{value === null ? "–" : pad(value)}</strong>
            <span>{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
