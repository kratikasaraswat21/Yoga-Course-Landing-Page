export interface CourseVideo {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  sortOrder: number;
  thumbnailUrl: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  discount: number;
  price: number;
  isPurchased: boolean;
  status: string;
  thumbnailUrl: string;
  totalPayableAmount: number;
  updatedAt: string;
  videoCount: number;
  courseVideos: CourseVideo[];
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
  thumbnailUrl: string;
  totalPayableAmount: number;
  videoCount: number;
}

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
  hlsUrl: string;
  dashUrl: string;
  thumbnailUrl: string;
}

export interface VideoPlaybackResponse {
  success: boolean;
  message: string;
  data: VideoPlayback;
}
