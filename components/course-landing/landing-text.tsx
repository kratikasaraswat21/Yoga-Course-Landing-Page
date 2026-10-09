"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useNow } from "@/hooks/useNow";
import { getCurrentPricing } from "@/lib/helper/course-pricing";
import { fillPlaceholders, getPlaceholderValues, pickPhase, splitHighlights } from "@/lib/helper/landing-text";
import type { CourseLandingPage, CoursePricing, PhaseText } from "@/types/course-landing";

interface LandingTextState {
  pricing: CoursePricing;
  /** True while the prelaunch offer is running: prelaunch texts and the countdown are shown. */
  isPrelaunch: boolean;
  values: Record<string, string>;
  now: number | null;
}

const LandingTextContext = createContext<LandingTextState | null>(null);

/**
 * Works out the price and phase for the visitor's current time. The page is cached, so this switches
 * at 12:00 AM IST even if the cached HTML was built a few minutes earlier. During server rendering it
 * uses the backend's values from when the data was fetched.
 */
export function LandingTextProvider({ page, children }: { page: CourseLandingPage; children: ReactNode }) {
  const now = useNow();
  const pricing = now === null ? page.pricing : getCurrentPricing(page.pricing, now);

  return (
    <LandingTextContext.Provider
      value={{
        pricing,
        isPrelaunch: pricing.offerType === "PRELAUNCH",
        values: getPlaceholderValues(page, pricing),
        now,
      }}>
      {children}
    </LandingTextContext.Provider>
  );
}

export function useLandingText() {
  const state = useContext(LandingTextContext);
  if (!state) throw new Error("useLandingText must be used inside LandingTextProvider");
  return state;
}

/** Renders admin text with {placeholders} filled and *words* highlighted. */
export function Txt({ text, phase }: { text?: string | null; phase?: PhaseText | null }) {
  const { isPrelaunch, values } = useLandingText();
  const source = (phase ? pickPhase(phase, isPrelaunch) : text) ?? "";

  return (
    <>
      {splitHighlights(fillPlaceholders(source, values)).map((part, index) =>
        part.highlighted ? <em key={index}>{part.text}</em> : <span key={index}>{part.text}</span>,
      )}
    </>
  );
}

/** Renders children only in the given phase (or only when the phase text isn't empty). */
export function PhaseOnly({ phase, children }: { phase: "prelaunch" | "live"; children: ReactNode }) {
  const { isPrelaunch } = useLandingText();
  return (phase === "prelaunch") === isPrelaunch ? <>{children}</> : null;
}

/** Renders children only while a prelaunch or discount offer is running (e.g. "{discount}% off" badges). */
export function WhenOffer({ children }: { children: ReactNode }) {
  const { pricing } = useLandingText();
  return pricing.offerType !== "NONE" ? <>{children}</> : null;
}

export function WhenPhaseText({ value, children }: { value?: PhaseText | null; children: ReactNode }) {
  const { isPrelaunch } = useLandingText();
  return value && (pickPhase(value, isPrelaunch) ?? "").trim() ? <>{children}</> : null;
}
