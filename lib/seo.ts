import type { Metadata } from "next";

export const metaImage = "/Kratika-Yoga-meta-image.png";

export function pageMetadata(title: string, description: string): Metadata {
  return { title, description };
}
