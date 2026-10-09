import { EnvConfig } from "@/lib/config/envConfig";
import type { CourseLandingPage, CourseLandingSlug } from "@/types/course-landing";

const COURSES_URL = EnvConfig.API_BASE_URL.endsWith("/app/api/v1")
  ? `${EnvConfig.API_BASE_URL}/courses`
  : `${EnvConfig.API_BASE_URL}/app/api/v1/courses`;

// Pages are refreshed on demand by the backend (see app/api/revalidate). The one-day
// revalidate is only a safety net in case a refresh call from the backend is lost.
const SAFETY_NET_REVALIDATE_SECONDS = 86_400;

// The backend sends the `courses` tag (plus `course:<id>`) after every change to a course, its
// videos, its landing content or its reviews, and at every midnight price/release boundary.
export const COURSES_CACHE_TAG = "courses";

/** Published courses that have their public landing page switched on. */
export async function getCourseLandingSlugs(): Promise<CourseLandingSlug[]> {
  if (!EnvConfig.API_BASE_URL) return [];

  try {
    const response = await fetch(`${COURSES_URL}/landing/slugs`, {
      next: { revalidate: SAFETY_NET_REVALIDATE_SECONDS, tags: [COURSES_CACHE_TAG] },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { success?: boolean; data?: { courses?: CourseLandingSlug[] } };
    return payload.success ? (payload.data?.courses ?? []) : [];
  } catch {
    return [];
  }
}

/**
 * Returns the landing page, `null` when the course doesn't exist, isn't published or has its
 * landing page switched off, and throws when the backend can't be reached (so a temporary
 * outage isn't cached as "not found").
 */
export async function getCourseLandingPage(slug: string): Promise<CourseLandingPage | null> {
  if (!EnvConfig.API_BASE_URL) throw new Error("Course service is not configured.");

  const response = await fetch(`${COURSES_URL}/landing/${encodeURIComponent(slug)}`, {
    next: { revalidate: SAFETY_NET_REVALIDATE_SECONDS, tags: [COURSES_CACHE_TAG] },
  });

  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) throw new Error(`Unable to load the course (${response.status}).`);

  const payload = (await response.json()) as { success?: boolean; data?: CourseLandingPage };
  if (!payload.success || !payload.data) throw new Error("Unable to load the course right now.");
  return payload.data;
}
