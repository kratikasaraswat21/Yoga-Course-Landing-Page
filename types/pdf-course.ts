export interface PdfCourse {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number;
  discount?: number;
  totalPayableAmount?: number;
  isAvailableForFree: boolean;
  status?: string;
  isPurchased: boolean;
  purchaseType?: "PAID" | "FREE";
  fileUrl?: string | null;
  purchasedAt?: string;
  updatedAt?: string;
}

export interface PdfCoursesResponse {
  success: boolean;
  message: string;
  data?: { pdfCourses?: PdfCourse[] };
}

export interface PdfCourseResponse {
  success: boolean;
  message: string;
  data?: { pdfCourse?: PdfCourse };
}

export interface PdfPurchaseOrderResponse {
  success: boolean;
  message: string;
  data?: {
    order?: {
      orderId?: string;
      razorpayOrderId?: string;
      amount?: number;
      currency?: string;
      keyId?: string;
      pdfCourseId?: string;
    };
  };
}

export interface PdfPaymentVerifyResponse {
  success: boolean;
  message: string;
  data?: { courseId?: string; isPurchased?: boolean; fileUrl?: string };
}

export interface PdfAccessResponse {
  success: boolean;
  message: string;
  data?: { courseId?: string; fileUrl?: string; expiresAt?: string };
}
