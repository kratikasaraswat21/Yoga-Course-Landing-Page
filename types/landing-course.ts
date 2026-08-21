export interface LandingCourse {
  courseId: string;
  title: string;
  description: string;
  rating: number;
  price: number;
  discount: number;
  totalPayableAmount: number;
  totalVideos: number;
  totalHours: number;
  totalStudents: number;
  thumbnail: string;
}

export interface LandingCoursesResponse {
  success: boolean;
  data?: { courses?: LandingCourse[] };
}
