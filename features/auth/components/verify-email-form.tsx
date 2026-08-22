"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { getDataFromSecureCookie, storeDataInSecureCookie } from "@/lib/helper/hepler";
import { validateVerifyEmailForm } from "@/lib/validation/auth.validation";

export function VerifyEmailForm({ email, returnTo }: { email: string; returnTo?: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [resendSeconds, setResendSeconds] = useState(42);
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (resendSeconds === 0) return;

    const timer = window.setInterval(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const submitVerify = useDebounce(async (formValues: { email: string; otp: string }) => {
    try {
      const response = await multipleApiHandler([
        {
          endPoint: "/auth/verify-otp",
          method: "POST",
          data: formValues,
        },
      ]);
      const res = response[0];

      if (!res?.data?.success) {
        toast.add({
          title: "Email verification failed",
          description: res?.data?.message ?? "Please try again.",
          type: "error",
        });
        return;
      }

      const token = res.data.data?.auth_token;
      if (!token) {
        toast.add({
          title: "Email verification failed",
          description: "Verification succeeded, but your session could not be created. Please try again.",
          type: "error",
        });
        return;
      }

      storeDataInSecureCookie(token, "yoga_platform_auth_token", true);
      const storedToken = getDataFromSecureCookie("yoga_platform_auth_token");
      if (storedToken !== token) {
        toast.add({
          title: "Sign-in could not be completed",
          description: "Your session could not be saved. Please try again.",
          type: "error",
        });
        return;
      }

      setSubmitted(true);
      toast.add({
        title: "Email verified",
        description: "Your email has been verified successfully.",
        type: "success",
      });
      const destination = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";
      router.replace(destination);
    } catch {
      toast.add({ title: "Email verification failed", description: "Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  });

  const submitResend = useDebounce(async (formEmail: string) => {
    try {
      const response = await multipleApiHandler([
        {
          endPoint: "/auth/resend-otp",
          method: "POST",
          data: { email: formEmail },
        },
      ]);
      const res = response[0];

      if (!res?.data?.success) {
        toast.add({ title: "Code not resent", description: res?.data?.message ?? "Please try again.", type: "error" });
        return;
      }

      setResendSeconds(60);
      toast.add({
        title: "Verification code sent",
        description: "Check your email for the new code.",
        type: "success",
      });
    } catch {
      toast.add({ title: "Code not resent", description: "Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateVerifyEmailForm({ code });
    setError(nextErrors.code);
    setSubmitted(false);

    if (nextErrors.code) return;
    if (!email) {
      toast.add({
        title: "Email required",
        description: "We need your email address to verify this code.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    submitVerify({ email, otp: code });
  };

  const handleResend = () => {
    if (resendSeconds > 0) return;
    setCode("");
    setError(undefined);
    setSubmitted(false);
    setIsSubmitting(true);
    submitResend(email);
  };

  const otpSlotClassName = [
    "!size-14 !rounded-xl !border bg-white text-2xl font-medium text-[#24302C] shadow-none sm:!size-20 sm:text-3xl",
    error
      ? "!border-[#B84A4A] data-[active=true]:!border-[#B84A4A] data-[active=true]:ring-4 data-[active=true]:ring-[#B84A4A]/15"
      : "!border-[#D8DDD8] data-[active=true]:!border-[#5D7D70] data-[active=true]:ring-4 data-[active=true]:ring-[#5D7D70]/15",
  ].join(" ");

  return (
    <form className="mt-9 flex flex-col gap-7" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-3">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => {
            setCode(value);
            setError(undefined);
            setSubmitted(false);
          }}
          aria-label="6-digit verification code"
          aria-invalid={Boolean(error)}
          containerClassName="w-full justify-start"
          className="w-full">
          <InputOTPGroup className="w-full justify-between gap-2 sm:gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot key={index} index={index} className={otpSlotClassName} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {error ? (
          <p className="text-sm text-[#B84A4A]" role="alert">
            {error}
          </p>
        ) : (
          <p className="text-base leading-6 text-[#66716D]">The code will expire in 10 minutes.</p>
        )}
      </div>

      <Button
        type="submit"
        className="h-[52px] w-full rounded-xl bg-[#213D34] text-base font-semibold text-white hover:bg-[#172E27]"
        disabled={isSubmitting}>
        {isSubmitting ? "Verifying email…" : "Verify email"}
      </Button>

      {submitted && (
        <p className="-mt-3 text-sm text-[#3F7A5A]" role="status">
          Your email has been verified successfully.
        </p>
      )}

      <div className="-mt-1 flex flex-col items-center gap-3 text-base text-[#66716D]">
        <p className="m-0">Didn’t receive the code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendSeconds > 0 || isSubmitting || !email}
          className="font-semibold text-[#213D34] underline-offset-4 transition hover:underline disabled:cursor-not-allowed disabled:text-[#66716D]">
          Resend code
        </button>
        <p className="m-0">
          Resend available in <span className="text-[#3F7A5A]">00:{String(resendSeconds).padStart(2, "0")}</span>
        </p>
      </div>
    </form>
  );
}
