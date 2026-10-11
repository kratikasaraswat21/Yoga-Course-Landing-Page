"use client";

import { Check, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useId, useState, type ReactNode } from "react";

import type { LandingRoadmapWeek } from "@/types/course-landing";
import { COMMON_BORDER_RADIUS } from "@/lib/constants/layout";
import { cn } from "@/lib/utils";
import { Txt } from "./landing-text";

const hasText = (value?: string | null) => (value ?? "").trim().length > 0;

// One point per line; a typed "•", "-" or "*" at the start is dropped (the page draws its own tick).
const toLines = (value?: string | null) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.replace(/^\s*[•\-*]\s*/, "").trim())
    .filter(Boolean);

/**
 * Week cards on the left, one open at a time (the first to start with); the open week's 16:9 image on
 * the right. Every image is stacked in place and faded in, so switching weeks never shifts the layout.
 */
export function RoadmapAccordion({
  weeks,
  children,
}: {
  weeks: LandingRoadmapWeek[];
  /** Shown under the cards, e.g. the button to the price card. */
  children?: ReactNode;
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  // The image stays on the last opened week when every card is closed.
  const [shownIndex, setShownIndex] = useState(0);

  const images = weeks.map((week) => week?.imageUrl || "");
  const hasImages = images.some(Boolean);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
    setShownIndex(index);
  };

  return (
    <div className={cn("lp-roadmap-body", hasImages && "lp-roadmap-with-photo")}>
      <div className="lp-roadmap-weeks">
        {weeks.map((week, index) => {
          const isOpen = openIndex === index;
          const points = toLines(week?.points);
          const buttonId = `${baseId}-week-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <div className={cn("lp-roadmap-card", COMMON_BORDER_RADIUS, isOpen && "is-open")} key={index}>
              <h3>
                <button aria-controls={panelId} aria-expanded={isOpen} id={buttonId} onClick={() => toggle(index)} type="button">
                  <span className="lp-roadmap-card-head">
                    <span className="lp-roadmap-card-title">
                      <Txt text={week?.title} />
                    </span>
                    {hasText(week?.text) && (
                      <span className="lp-roadmap-card-text">
                        <Txt text={week?.text} />
                      </span>
                    )}
                  </span>
                  {isOpen ? (
                    <Minus aria-hidden="true" className="lp-roadmap-card-icon" size={20} strokeWidth={1.8} />
                  ) : (
                    <Plus aria-hidden="true" className="lp-roadmap-card-icon" size={20} strokeWidth={1.8} />
                  )}
                </button>
              </h3>
              <div aria-labelledby={buttonId} className="lp-roadmap-panel" id={panelId} inert={!isOpen} role="region">
                <div>
                  {hasText(week?.pointsTitle) && (
                    <p className="lp-roadmap-label">
                      <Txt text={week?.pointsTitle} />
                    </p>
                  )}
                  {points.length > 0 && (
                    <ul>
                      {points.map((point, pointIndex) => (
                        <li key={pointIndex}>
                          <Check aria-hidden="true" size={20} strokeWidth={2.25} />
                          <span>
                            <Txt text={point} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {children}
      </div>

      {hasImages && (
        <div className={cn("lp-roadmap-photo", COMMON_BORDER_RADIUS)}>
          {images.map((src, index) =>
            src ? (
              <Image
                alt=""
                aria-hidden={shownIndex !== index}
                className={cn(shownIndex === index && "is-shown")}
                fill
                key={index}
                priority={false}
                sizes="(max-width: 900px) 100vw, 45vw"
                src={src}
              />
            ) : null,
          )}
          {hasText(weeks[shownIndex]?.title) && (
            <span className="lp-roadmap-caption" key={shownIndex}>
              <Txt text={weeks[shownIndex]?.title} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
