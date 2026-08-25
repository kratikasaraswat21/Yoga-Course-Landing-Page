export interface LandingReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
  courseTitle: string;
}

export interface LandingReviewsResponse {
  success: boolean;
  data?: {
    reviews?: Array<{
      id?: string;
      rating?: number;
      comment?: string;
      createdAt?: string;
      user?: { name?: string };
      course?: { id?: string; title?: string };
    }>;
  };
}
