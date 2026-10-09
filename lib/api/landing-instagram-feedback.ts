import { EnvConfig } from "@/lib/config/envConfig";

const FEEDBACK_URL = EnvConfig.API_BASE_URL.endsWith("/app/api/v1")
  ? `${EnvConfig.API_BASE_URL}/instagram-feedback`
  : `${EnvConfig.API_BASE_URL}/app/api/v1/instagram-feedback`;

// Refreshed on demand by the backend through this tag (see app/api/revalidate) whenever the admin adds,
// reorders or deletes an image. The one-day revalidate is only a safety net.
export const INSTAGRAM_FEEDBACK_CACHE_TAG = "instagram-feedback";

export interface InstagramFeedbackImage {
  id: string;
  imageUrl: string;
  altText: string | null;
}

/** Feedback screenshots managed in the admin panel, in their order. Empty when there are none or on error. */
export async function getInstagramFeedbackImages(): Promise<InstagramFeedbackImage[]> {
  if (!EnvConfig.API_BASE_URL) return [];

  try {
    const response = await fetch(FEEDBACK_URL, {
      next: { revalidate: 86_400, tags: [INSTAGRAM_FEEDBACK_CACHE_TAG] },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { success?: boolean; data?: { images?: InstagramFeedbackImage[] } };
    return payload.success ? (payload.data?.images ?? []).filter((image) => image?.imageUrl) : [];
  } catch {
    return [];
  }
}
