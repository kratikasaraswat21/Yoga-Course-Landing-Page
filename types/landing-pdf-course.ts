export interface LandingPdfCourse {
  id: string;
  thumbnailUrl: string;
  price: number;
  discount: number;
  totalPayableAmount: number;
  title: string;
  description: string;
  enrolledStudents: number;
}

export interface LandingPdfCoursesResponse {
  success: boolean;
  data?: { pdfCourses?: LandingPdfCourse[] };
}
