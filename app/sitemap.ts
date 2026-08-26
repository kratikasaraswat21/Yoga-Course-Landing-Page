import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    "/",
    "/courses",
    "/pdf-courses",
    "/affiliate-products",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/sitemap",
  ];

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
