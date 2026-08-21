"use client";

import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { validateSignupForm } from "@/lib/validation/auth.validation";
import type { SignupFormData } from "@/types/user";

const initialValues: SignupFormData = { fullName: "", email: "", password: "", acceptedTerms: false };

export function SignupForm({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ReturnType<typeof validateSignupForm>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [verificationSignature, setVerificationSignature] = useState("");

  const updateValue = <T extends keyof SignupFormData>(field: T, value: SignupFormData[T]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submitSignup = useDebounce(async (formValues: SignupFormData) => {
    try {
      const response = await multipleApiHandler([
        {
          endPoint: "/auth/sign-up",
          method: "POST",
          data: { name: formValues.fullName.trim(), email: formValues.email.trim(), password: formValues.password },
        },
      ]);
      const res = response[0];

      if (!res?.data?.success) {
        toast.add({ title: "Sign up failed", description: res?.data?.message ?? "Please try again.", type: "error" });
        return;
      }

      setVerificationDialogOpen(true);
      setVerificationSignature(res?.data?.data?.email);
      toast.add({ title: "Account created", description: "Please verify your email to continue.", type: "success" });
    } catch {
      toast.add({ title: "Sign up failed", description: "Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateSignupForm(values);
    setErrors(nextErrors);
    setSubmitted(false);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    submitSignup(values);
  };

  return (
    <form className="login-form signup-form" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="full-name">Full name</label>
        <Input
          id="full-name"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={values.fullName}
          onChange={(event) => updateValue("fullName", event.target.value)}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "full-name-error" : undefined}
          className={errors.fullName ? "login-input input-error" : "login-input"}
        />
        {errors.fullName && (
          <p id="full-name-error" className="field-error">
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="signup-email">Email address</label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          className={errors.email ? "login-input input-error" : "login-input"}
        />
        {errors.email && (
          <p id="signup-email-error" className="field-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="signup-password">Password</label>
        <div className="password-wrap">
          <Input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={(event) => updateValue("password", event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "signup-password-error" : "password-hint"}
            className={errors.password ? "login-input input-error password-input" : "login-input password-input"}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </div>
        {errors.password && (
          <p id="signup-password-error" className="field-error">
            {errors.password}
          </p>
        )}
      </div>

      <div className="terms-group">
        <label className="remember-option terms-option">
          <input
            type="checkbox"
            checked={values.acceptedTerms}
            onChange={(event) => updateValue("acceptedTerms", event.target.checked)}
            aria-invalid={Boolean(errors.acceptedTerms)}
            aria-describedby={errors.acceptedTerms ? "terms-error" : undefined}
          />
          <span>
            I agree to the{" "}
            <Link href="#terms" id="terms">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#privacy" id="privacy">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptedTerms && (
          <p id="terms-error" className="field-error">
            {errors.acceptedTerms}
          </p>
        )}
      </div>

      <Button type="submit" className="login-submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      {submitted && (
        <p className="form-status" role="status">
          Your account details look good. You can continue.
        </p>
      )}
      <AlertDialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
        <AlertDialogContent className="verification-dialog">
          <AlertDialogHeader className="verification-dialog-header">
            <AlertDialogMedia className="verification-dialog-media">
              <Mail aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="verification-dialog-title">Please verify your email</AlertDialogTitle>
            <AlertDialogDescription className="verification-dialog-description">
              We’ve sent a verification link to <strong className="font-semibold text-[#24302C]">{values.email}</strong>
              . Please check your inbox and verify your email to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="verification-dialog-footer">
            <AlertDialogAction
              onClick={() =>
                router.push(
                  `/verify-email?email=${encodeURIComponent(values.email.trim())}&signature=${verificationSignature}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`,
                )
              }
              className="verification-dialog-action">
              Continue to verification
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
