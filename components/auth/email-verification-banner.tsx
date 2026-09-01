"use client";

import { Loader2, Mail, MailCheck } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { multipleApiHandler } from "@/lib/api/multiple.api";

export function EmailVerificationBanner({ email, encryptedToken }: { encryptedToken: string; email?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const verificationUrl = email
    ? `/verify-email?email=${encodeURIComponent(email)}&signature=${encodeURIComponent(encryptedToken)}`
    : "/verify-email";

  const handleVerifyEmail = async () => {
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const [response] = await multipleApiHandler([
        { endPoint: "/auth/resend-otp", method: "POST", data: { email: encryptedToken } },
      ]);

      if (!response?.data?.success) {
        toast.add({
          title: "Verification email not sent",
          description: response?.data?.message ?? "Please try again.",
          type: "error",
        });
        return;
      }

      setVerificationDialogOpen(true);
    } catch {
      toast.add({ title: "Verification email not sent", description: "Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="email-verification-banner" role="alert">
        <MailCheck aria-hidden="true" size={22} />
        <div className="email-verification-message">
          <strong>Please verify your email address</strong>
          <span>Click “Verify email” to verify your email address and secure your account.</span>
        </div>
        <button
          className="email-verification-action"
          type="button"
          onClick={handleVerifyEmail}
          disabled={!email || isSubmitting}>
          {isSubmitting ? <Loader2 aria-hidden="true" className="animate-spin" size={16} /> : null}
          {isSubmitting ? "Sending…" : "Verify email"}
        </button>
      </div>

      <AlertDialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
        <AlertDialogContent className="verification-dialog">
          <AlertDialogHeader className="verification-dialog-header">
            <AlertDialogMedia className="verification-dialog-media">
              <Mail aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="verification-dialog-title">Please verify your email</AlertDialogTitle>
            <AlertDialogDescription className="verification-dialog-description">
              We’ve sent a verification code to <strong className="font-semibold text-[#24302C]">{email}</strong>.
              Please check your inbox and verify your email to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="verification-dialog-footer">
            <AlertDialogAction
              onClick={() => window.open(verificationUrl, "_blank", "noopener,noreferrer")}
              className="verification-dialog-action">
              Continue to verification
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
