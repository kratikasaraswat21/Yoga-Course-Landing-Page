import type { Metadata } from "next";

export const metaImage = "/Kratika-Yoga-meta-image.png";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kratikayoga.com").replace(/\/$/, "");

export function pageMetadata(title: string, description: string, path = "/"): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
  };
}
