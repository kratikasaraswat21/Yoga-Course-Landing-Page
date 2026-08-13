"use client";

import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { validateResetPasswordForm } from "@/lib/validation/auth.validation";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ReturnType<typeof validateResetPasswordForm>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitResetPassword = useDebounce(async (formValues: { token: string; password: string }) => {
    try {
      const response = await multipleApiHandler([
        {
          endPoint: "/auth/reset-password",
          method: "POST",
          data: formValues,
        },
      ]);
      const res = response[0];

      if (!res?.data?.success) {
        toast.add({ title: "Password reset failed", description: res?.data?.message ?? "Please try again.", type: "error" });
        return;
      }

      setSubmitted(true);
      toast.add({ title: "Password reset", description: "Your password has been updated successfully.", type: "success" });
    } catch {
      toast.add({ title: "Password reset failed", description: "Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateResetPasswordForm({ password, confirmPassword });
    setErrors(nextErrors);
    setSubmitted(false);

    if (Object.keys(nextErrors).length > 0) return;
    if (!token) {
      toast.add({ title: "Invalid reset link", description: "Please request a new password reset link.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    submitResetPassword({ token, password });
  };

  return (
    <form className="login-form mt-12 w-full" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="reset-password">New password</label>
        <div className="password-wrap">
          <Input
            id="reset-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your new password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
              setSubmitted(false);
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "reset-password-error" : "reset-password-hint"}
            className={errors.password ? "login-input input-error password-input" : "login-input password-input"}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide new password" : "Show new password"}>
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </div>
        {errors.password && (
          <p id="reset-password-error" className="field-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="confirm-reset-password">Confirm new password</label>
        <div className="password-wrap">
          <Input
            id="confirm-reset-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setErrors((current) => ({ ...current, confirmPassword: undefined }));
              setSubmitted(false);
            }}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirm-reset-password-error" : undefined}
            className={errors.confirmPassword ? "login-input input-error password-input" : "login-input password-input"}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}>
            {showConfirmPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-reset-password-error" className="field-error" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button type="submit" className="login-submit" disabled={isSubmitting}>
        {isSubmitting ? "Resetting password…" : "Reset password"}
      </Button>

      {submitted && (
        <p className="form-status" role="status">
          Your password has been reset successfully. You can log in now.
        </p>
      )}
    </form>
  );
}
