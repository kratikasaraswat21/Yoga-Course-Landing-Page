"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { FeedbackImage } from "@/components/landing-page/feedback-images";
import { COMMON_BORDER_RADIUS } from "@/lib/constants/layout";

/** Horizontal strip of feedback screenshots; tap one to see it large. */
export function FeedbackScreenshots({ images }: { images: FeedbackImage[] }) {
  const [openImage, setOpenImage] = useState<FeedbackImage | null>(null);

  useEffect(() => {
    if (!openImage) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpenImage(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [openImage]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="lp-shots lp-rv">
        {images.map((image, index) => (
          <button
            key={image.key}
            type="button"
            onClick={() => setOpenImage(image)}
            aria-label={`Enlarge student feedback ${index + 1}`}>
            {/* Shown 420px tall; each screenshot keeps its own width (width: auto in course-landing.css). */}
            <Image className={COMMON_BORDER_RADIUS} src={image.src} alt={image.alt} width={236} height={420} sizes="240px" />
          </button>
        ))}
      </div>
      <p className="lp-hint">Swipe to see more · tap a screenshot to enlarge</p>
      {openImage && (
        <button
          type="button"
          className="lp-lightbox"
          onClick={() => setOpenImage(null)}
          aria-label="Close enlarged screenshot">
          <Image src={openImage.src} alt={openImage.alt} width={900} height={1600} sizes="92vw" />
        </button>
      )}
    </>
  );
}
