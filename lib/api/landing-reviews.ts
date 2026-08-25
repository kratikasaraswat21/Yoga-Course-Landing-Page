import { EnvConfig } from "@/lib/config/envConfig";
import type { LandingReview, LandingReviewsResponse } from "@/types/landing-review";

const REVIEWS_URL = EnvConfig.API_BASE_URL.endsWith("/app/api/v1")
  ? `${EnvConfig.API_BASE_URL}/courses/reviews`
  : `${EnvConfig.API_BASE_URL}/app/api/v1/courses/reviews`;

export async function getLandingReviews(): Promise<{ reviews: LandingReview[]; error?: string }> {
  if (!EnvConfig.API_BASE_URL) return { reviews: [], error: "Review service is not configured." };

  try {
    const response = await fetch(REVIEWS_URL, { next: { revalidate: 600, tags: ["landing-reviews"] } });
    if (!response.ok) return { reviews: [], error: `Unable to load reviews (${response.status}).` };

    const payload = (await response.json()) as LandingReviewsResponse;
    if (!payload.success) return { reviews: [], error: "Unable to load reviews right now." };

    const reviews = (payload.data?.reviews ?? []).map((review, index) => ({
      id: review.id ?? `review-${index}`,
      rating: Math.min(5, Math.max(0, Number(review.rating) || 0)),
      comment: review.comment ?? "",
      createdAt: review.createdAt ?? "",
      userName: review.user?.name ?? "Yoga student",
      courseTitle: review.course?.title ?? "Yoga course",
    }));

    return { reviews };
  } catch {
    return { reviews: [], error: "Unable to connect to the review service." };
  }
}
