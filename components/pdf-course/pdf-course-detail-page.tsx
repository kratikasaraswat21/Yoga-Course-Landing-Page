"use client";

import loginYoga from "@/assets/images/auth/login-yoga.webp";
import { PdfCourseSkeleton } from "@/components/pdf-course/pdf-course-skeleton";
import { CourseErrorState } from "@/components/shared/course-error-state";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { EnvConfig } from "@/lib/config/envConfig";
import type { RazorpayPaymentResponse, WindowWithRazorpay } from "@/types/payment";
import type {
  PdfAccessResponse,
  PdfCourse,
  PdfCourseResponse,
  PdfPaymentVerifyResponse,
  PdfPurchaseOrderResponse,
} from "@/types/pdf-course";
import { ArrowLeft, BookOpen, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

const fallbackImage = loginYoga;

export default function PdfCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<PdfCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "opening" | "verifying">("idle");

  const fetchCourse = useDebounce(async () => {
    try {
      setIsLoading(true);
      const response = await multipleApiHandler([
        { endPoint: `/pdf-courses/${courseId}`, method: "GET", protected: true },
      ]);
      const result = response[0]?.data as PdfCourseResponse | undefined;
      if (!response[0]?.ok || !result?.success || !result.data?.pdfCourse)
        throw new Error(result?.message ?? "PDF course could not be loaded.");
      setCourse(result.data.pdfCourse);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "PDF course could not be loaded.";
      setError(message);
      toast.add({ title: "PDF course could not be loaded", description: message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const downloadPdf = useDebounce(async () => {
    if (!course) return;
    const response = await multipleApiHandler([
      { endPoint: `/pdf-courses/${course.id}/access`, method: "GET", protected: true },
    ]);
    const result = response[0]?.data as PdfAccessResponse | undefined;
    if (!response[0]?.ok || !result?.success || !result.data?.fileUrl) {
      toast.add({
        title: "PDF could not be opened",
        description: result?.message ?? "Access could not be granted.",
        type: "error",
      });
      return;
    }

    try {
      const fileResponse = await fetch(result.data.fileUrl);
      if (!fileResponse.ok) throw new Error("The PDF file could not be downloaded.");
      const fileBlob = await fileResponse.blob();
      const downloadUrl = URL.createObjectURL(fileBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = `${course.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "yoga-pdf-course"}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      toast.add({ title: "PDF download failed", description: "Please try again.", type: "error" });
    }
  }, 0);

  const verifyPayment = useDebounce(async (payment: RazorpayPaymentResponse) => {
    const response = await multipleApiHandler([
      {
        endPoint: "/payments/verify",
        method: "POST",
        protected: true,
        data: {
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpaySignature: payment.razorpay_signature,
        },
      },
    ]);
    const result = response[0]?.data as PdfPaymentVerifyResponse | undefined;
    if (!response[0]?.ok || !result?.success) {
      setPaymentStatus("idle");
      toast.add({
        title: "Payment verification failed",
        description: result?.message ?? "Please try again.",
        type: "error",
      });
      return;
    }
    setPaymentStatus("idle");
    setCourse((currentCourse) =>
      currentCourse ? { ...currentCourse, isPurchased: true, fileUrl: result.data?.fileUrl ?? null } : currentCourse,
    );
    toast.add({ title: "PDF course purchased", description: "Your PDF is now available.", type: "success" });
  }, 0);

  const purchaseCourse = useDebounce(async () => {
    if (!course || paymentStatus !== "idle") return;
    if (course.isPurchased || course.isAvailableForFree) {
      downloadPdf();
      return;
    }
    const razorpayWindow = window as WindowWithRazorpay;
    if (!EnvConfig.RAZORPAY_KEY_ID || !isRazorpayReady || !razorpayWindow.Razorpay) {
      toast.add({
        title: "Payment unavailable",
        description: "Payment checkout is still loading. Please try again.",
        type: "error",
      });
      return;
    }
    setPaymentStatus("opening");
    const response = await multipleApiHandler([
      {
        endPoint: "/payments/pdf-orders",
        method: "POST",
        protected: true,
        data: { pdfCourseId: course.id },
      },
    ]);
    const result = response[0]?.data as PdfPurchaseOrderResponse | undefined;
    const order = result?.data?.order;
    if (!response[0]?.ok || !result?.success || !order?.orderId) {
      setPaymentStatus("idle");
      toast.add({
        title: "Purchase could not be started",
        description: result?.message ?? "Please try again.",
        type: "error",
      });
      return;
    }
    const checkout = new razorpayWindow.Razorpay({
      key: EnvConfig.RAZORPAY_KEY_ID,
      amount: order.amount ?? 0,
      currency: order.currency ?? "INR",
      name: "Kratika Yoga",
      description: course.title,
      order_id: order.razorpayOrderId ?? order.orderId,
      handler: (payment) => {
        setPaymentStatus("verifying");
        verifyPayment(payment);
      },
      modal: { ondismiss: () => setPaymentStatus("idle") },
    });
    checkout.open();
  }, 0);

  if (isLoading) return <PdfCourseSkeleton />;
  if (error || !course) return <CourseErrorState message={error || "PDF course not found."} onRetry={fetchCourse} />;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setIsRazorpayReady(true)}
      />
      <div className="pdf-course-detail-page">
        <Link className="pdf-back-link" href="/pdf-course/explore">
          <ArrowLeft size={16} /> PDF courses
        </Link>
        <section className="pdf-course-detail-card">
          <div className="pdf-detail-cover">
            <Image
              src={course.thumbnailUrl || fallbackImage}
              alt={course.title}
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
            />
          </div>
          <div className="pdf-detail-copy">
            <span className="eyebrow">PDF COURSE</span>
            <h1 className="title-case">{course.title}</h1>
            <p>{course.description}</p>
            {!course.isPurchased && !course.isAvailableForFree && (
              <div className="pdf-detail-price">
                {(course.discount ?? 0) > 0 && <del>₹{(course.price ?? 0).toLocaleString("en-IN")}</del>}
                {(course.discount ?? 0) > 0 && <span className="discount">{course.discount}% off</span>}
                <strong>
                  ₹{(((course.discount ?? 0) > 0 ? course.totalPayableAmount ?? course.price : course.price) ?? 0).toLocaleString("en-IN")}
                </strong>
              </div>
            )}
            <button className="detail-primary" disabled={paymentStatus !== "idle"} onClick={() => purchaseCourse()}>
              {paymentStatus === "opening"
                ? "Preparing payment..."
                : paymentStatus === "verifying"
                  ? "Verifying payment..."
                  : course.isPurchased
                    ? "Download PDF"
                    : course.isAvailableForFree
                      ? "Get PDF"
                      : "Purchase PDF"}
            </button>
            <div className="secure-payment">
              <ShieldCheck size={16} /> Secure access to your PDF
            </div>
          </div>
        </section>
        {course.isPurchased && (
          <div className="pdf-access-note">
            <BookOpen size={18} /> Your access is active. The secure file link is generated when you open the PDF.
          </div>
        )}
      </div>
    </>
  );
}
