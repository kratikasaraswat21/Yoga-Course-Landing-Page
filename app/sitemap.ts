import type { MetadataRoute } from "next";
import { getCourseLandingSlugs } from "@/lib/api/course-landing";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Course landing pages exist only for published courses with the landing page switched on.
  const courses = await getCourseLandingSlugs();

  return [
    ...publicRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    })),
    ...courses.map((course) => ({
      url: `${siteUrl}/courses/${course.slug}`,
      lastModified: new Date(course.updatedAt),
    })),
  ];
}
