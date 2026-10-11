"use client";

import { useEffect } from "react";

/**
 * Fades sections in as they scroll into view. Only active once JavaScript runs (it adds `lp-js`
 * to the page), so content is never hidden without JavaScript.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const root = document.querySelector(".lp");
    if (!root) return;
    root.classList.add("lp-js");

    const elements = root.querySelectorAll(".lp-rv");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("lp-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lp-in");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
