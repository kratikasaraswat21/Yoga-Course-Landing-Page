"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  label?: string;
}

export function StarRating({ value, onChange, readOnly = false, label = "Rating" }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayedValue = hoverValue ?? value;

  const updateRating = (nextValue: number) => {
    if (!readOnly) onChange?.(Math.max(0, Math.min(5, Math.round(nextValue * 2) / 2)));
  };

  return (
    <div
      className={`star-rating${readOnly ? " star-rating-readonly" : ""}`}
      role={readOnly ? undefined : "radiogroup"}
      aria-label={label}
      onMouseLeave={() => setHoverValue(null)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(100, (displayedValue - star + 1) * 100));
        const starButton = (
          <span
            className="star-rating-visual"
            style={{ "--star-fill": `${fill}%` } as React.CSSProperties}
            aria-hidden="true">
            ★
          </span>
        );

        if (readOnly) return <span key={star}>{starButton}</span>;

        return (
          <button
            type="button"
            key={star}
            role="radio"
            aria-checked={value === star || value === star - 0.5}
            aria-label={`${star - 0.5} or ${star} out of 5 stars`}
            onMouseMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              setHoverValue(event.clientX - bounds.left < bounds.width / 2 ? star - 0.5 : star);
            }}
            onClick={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              updateRating(event.clientX - bounds.left < bounds.width / 2 ? star - 0.5 : star);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault();
                updateRating(value + 0.5);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault();
                updateRating(value - 0.5);
              }
              if (event.key === "Home") {
                event.preventDefault();
                updateRating(0);
              }
              if (event.key === "End") {
                event.preventDefault();
                updateRating(5);
              }
            }}>
            {starButton}
          </button>
        );
      })}
    </div>
  );
}
