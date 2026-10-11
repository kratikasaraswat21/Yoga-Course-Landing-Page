import type { CoursePricing } from "@/types/course-landing";

export interface CourseVideo {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  sortOrder: number;
  thumbnailUrl: string;
  createdAt: string;
  isCompleted?: boolean;
  /**
   * True for a video the viewer can't open yet: a future release date (prelaunch buyers and people who
   * haven't bought yet) or, when the course locks videos in order, a video after the buyer's next one.
   */
  isLocked?: boolean;
  /** Why the video is locked: SCHEDULED (release date) or SEQUENTIAL (finish the previous video first). */
  lockReason?: "SCHEDULED" | "SEQUENTIAL" | null;
  releaseAt?: string | null;
  /** YYYY-MM-DD (IST) day the video unlocks. */
  releaseDate?: string | null;
}

/** A week/group of videos. `id` is null for "Other videos" (videos without a group). */
export interface CourseVideoGroup {
  id: string | null;
  title: string;
  description: string | null;
  videoCount: number;
  totalDurationSeconds: number;
  videos: CourseVideo[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  discount: number;
  price: number;
  isPurchased: boolean;
  isAccessRevoked?: boolean;
  isCourseCompleted?: boolean;
  hasReviewed?: boolean;
  averageRating?: number;
  totalReviews?: number;
  reviewCount?: number;
  status: string;
  thumbnailUrl: string;
  totalPayableAmount: number;
  updatedAt: string;
  videoCount: number;
  courseVideos: CourseVideo[];
  pricing?: CoursePricing;
  isPrelaunchPurchase?: boolean;
  /** Weeks/groups; empty when the course doesn't group its videos (show `courseVideos` as one list). */
  groups?: CourseVideoGroup[];
  upcomingReleaseDate?: string | null;
  /** Buyers must complete each video before the next one opens. */
  sequentialUnlock?: boolean;
  /** The buyer's next video: the first released one not completed yet ("Continue"). */
  nextVideoId?: string | null;
}

export interface CourseDetailsResponse {
  success: boolean;
  message: string;
  data: { course: Course };
}

export interface ApiCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  thumbnailUrl: string;
  totalPayableAmount: number;
  videoCount: number;
  createdAt?: string;
  progress?: number;
  completedVideoCount?: number;
  completedLessons?: number;
  completed?: number;
  /** Set when the course has a public landing page at /courses/<slug>. */
  slug?: string;
  landingPageEnabled?: boolean;
}

/** "View course" for a course the user hasn't bought: its landing page when it has one, otherwise the course page. */
export const getCourseViewHref = (course: Pick<ApiCourse, "id" | "slug" | "landingPageEnabled">) =>
  course.landingPageEnabled && course.slug ? `/courses/${course.slug}` : `/course/enrolled/${course.id}`;

export interface CoursesResponse {
  success: boolean;
  message: string;
  data?: { courses?: ApiCourse[] };
}

export interface VideoPlayback {
  videoId: string;
  title: string;
  durationSeconds: number;
  playbackToken: string;
  expiresInSeconds: number;
  isCompleted: boolean;
  hasReviewed?: boolean;
  hlsUrl: string;
  dashUrl: string;
  thumbnailUrl: string;
}

export interface VideoPlaybackResponse {
  success: boolean;
  message: string;
  data: VideoPlayback;
}
