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
