"use client";

import { CourseCompletionSection, CourseDetailHero, CourseVideoSection } from "@/components/course/course-detail";
import { CourseDetailSkeleton } from "@/components/course/course-skeletons";
import { CourseErrorState } from "@/components/shared/course-error-state";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { EnvConfig } from "@/lib/config/envConfig";
import type { Course, CourseDetailsResponse } from "@/types/course";
import type { RazorpayOrder, RazorpayPaymentResponse, WindowWithRazorpay } from "@/types/payment";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "opening" | "confirming">("idle");
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const fetchCourse = useDebounce(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await multipleApiHandler([{ endPoint: `/courses/${courseId}`, method: "GET", protected: true }]);
      const res = response[0] as { data?: CourseDetailsResponse } | undefined;
      if (!res?.data?.success) {
        const message = res?.data?.message ?? "Course could not be loaded.";
        setError(message);
        toast.add({ title: "Course could not be loaded", description: message, type: "error" });
        return;
      }
      setCourse(res.data.data.course);
    } catch {
      const message = "Course could not be loaded. Please try again.";
      setError(message);
      toast.add({ title: "Course could not be loaded", description: message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleBuyCourse = async () => {
    if (!course || course.isAccessRevoked || paymentStatus !== "idle") return;

    const razorpayKey = EnvConfig.RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast.add({ title: "Payment unavailable", description: "Razorpay is not configured.", type: "error" });
      return;
    }

    const razorpayWindow = window as WindowWithRazorpay;
    if (!isRazorpayReady || !razorpayWindow.Razorpay) {
      toast.add({ title: "Payment unavailable", description: "Payment checkout is still loading. Please try again.", type: "error" });
      return;
    }

    setPaymentStatus("opening");

    try {
      const orderResponse = await multipleApiHandler([
        { endPoint: "/payments/orders", method: "POST", protected: true, data: { courseId: course.id } },
      ]);
      const orderResult = orderResponse[0]?.data;
      const orderData = orderResult?.data as { order?: RazorpayOrder } | undefined;
      const order = orderData?.order;

      if (!orderResponse[0]?.ok || !orderResult?.success || !order?.razorpayOrderId) {
        throw new Error(orderResult?.message ?? "Could not create a payment order.");
      }

      const verifyPayment = async (payment: RazorpayPaymentResponse) => {
        const verifyResponse = await multipleApiHandler([
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
        const verifyResult = verifyResponse[0]?.data;

        if (!verifyResponse[0]?.ok || !verifyResult?.success) {
          throw new Error(verifyResult?.message ?? "Payment verification failed.");
        }

        const timeoutAt = Date.now() + 60_000;
        while (Date.now() < timeoutAt) {
          await new Promise((resolve) => setTimeout(resolve, 2_500));

          try {
            const courseResponse = await multipleApiHandler([
              { endPoint: `/courses/${courseId}`, method: "GET", protected: true },
            ]);
            const courseResult = courseResponse[0]?.data as CourseDetailsResponse | undefined;
            const latestCourse = courseResult?.data?.course;

            if (courseResult?.success && latestCourse) {
              setCourse(latestCourse);
              if (latestCourse.isPurchased) {
                setPaymentStatus("idle");
                router.replace(`/course/enrolled/${courseId}`, { scroll: false });
                toast.add({ title: "Payment successful", description: "You now have lifetime access to this course.", type: "success" });
                return;
              }
            }
          } catch {
            // Keep polling because the webhook may still be processing.
          }
        }

        setPaymentStatus("idle");
        router.replace(`/course/enrolled/${courseId}`, { scroll: false });
        throw new Error("Payment received, but course access is still being updated. Please refresh shortly.");
      };

      const checkout = new razorpayWindow.Razorpay({
        key: order.keyId ?? razorpayKey,
        amount: order.amount ?? Math.round(course.price * 100),
        currency: order.currency ?? "INR",
        name: "Kratika Yoga",
        description: course.title,
        order_id: order.razorpayOrderId,
        handler: (payment) => {
          setPaymentStatus("confirming");
          router.replace(`/course/enrolled/${courseId}?payment=verifying`, { scroll: false });
          void verifyPayment(payment).catch((verificationError: unknown) => {
            setPaymentStatus("idle");
            router.replace(`/course/enrolled/${courseId}`, { scroll: false });
            toast.add({
              title: "Payment verification failed",
              description: verificationError instanceof Error ? verificationError.message : "Please contact support.",
              type: "error",
            });
          });
        },
        modal: { ondismiss: () => setPaymentStatus("idle") },
      });

      checkout.open();
    } catch (paymentError: unknown) {
      setPaymentStatus("idle");
      toast.add({
        title: "Payment could not be started",
        description: paymentError instanceof Error ? paymentError.message : "Please try again.",
        type: "error",
      });
    }
  };

  if (isLoading) return <CourseDetailSkeleton />;
  if (error || !course) {
    return <CourseErrorState message={error || "Course not found."} onRetry={fetchCourse} />;
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setIsRazorpayReady(true)}
      />
      {paymentStatus === "confirming" && (
        <div className="payment-verification-backdrop" role="dialog" aria-modal="true" aria-live="polite">
          <div className="payment-verification-modal">
            <div className="payment-verification-animation" aria-hidden="true">
              <span className="verification-spinner" />
            </div>
            <h2>Confirming payment…</h2>
            <p>We&apos;re securely confirming your payment. This may take a moment.</p>
          </div>
        </div>
      )}
      <div className="course-detail-page">
        <nav className="course-breadcrumb">
          <Link href="/course/enrolled">Courses</Link>
          <ChevronRight size={16} />
          <span className="title-case">{course.title}</span>
        </nav>
        <CourseDetailHero course={course} paymentStatus={paymentStatus} onBuyCourse={handleBuyCourse} />
        <CourseCompletionSection course={course} />
        <CourseVideoSection course={course} />
      </div>
    </>
  );
}
