"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import {
  getAuthToken,
  removeDataFromSecureCookie,
  removeDataFromSessionStorage,
  storeDataInSecureCookie,
  storeDataInSessionStorage,
} from "@/lib/helper/hepler";
import { validateEmailAddress, validateLoginForm } from "@/lib/validation/auth.validation";
import type { LoginFormData } from "@/types/user";

const initialValues: LoginFormData = { email: "", password: "" };

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ReturnType<typeof validateLoginForm>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = (field: keyof LoginFormData, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    if (field === "email") {
      setErrors((current) => ({
        ...current,
        email: value.trim() ? validateEmailAddress(value) : undefined,
      }));
    } else if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const submitLogin = useDebounce(async (formValues: LoginFormData) => {
    try {
      const response = await multipleApiHandler([
        {
          endPoint: "/auth/login",
          method: "POST",
          data: formValues,
        },
      ]);
      const res = response[0];

      if (!res?.data?.success) {
        toast.add({ title: "Login failed", description: res?.data?.message ?? "Please try again.", type: "error" });
        return;
      }

      const token = res.data.data?.auth_token;
      if (!token) {
        toast.add({
          title: "Login failed",
          description: "No authentication token was returned. Please try again.",
          type: "error",
        });
        return;
      }

      if (rememberMe) {
        removeDataFromSessionStorage("yoga_platform_auth_token");
        storeDataInSecureCookie(token, "yoga_platform_auth_token", true);
      } else {
        removeDataFromSecureCookie("yoga_platform_auth_token");
        storeDataInSessionStorage(token, "yoga_platform_auth_token");
      }

      if (getAuthToken("yoga_platform_auth_token") !== token) {
        toast.add({
          title: "Login failed",
          description: "Your session could not be saved. Please try again.",
          type: "error",
        });
        return;
      }

      setSubmitted(true);
      toast.add({ title: "Welcome back", description: "You have been logged in successfully.", type: "success" });
      const destination = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";
      router.replace(destination);
    } catch {
      toast.add({ title: "Login failed", description: "Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    setSubmitted(false);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    submitLogin(values);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="email">Email address</label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={errors.email ? "login-input input-error" : "login-input"}
        />
        {errors.email && (
          <p id="email-error" className="field-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="password">Password</label>
        <div className="password-wrap">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(event) => updateValue("password", event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
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
          <p id="password-error" className="field-error">
            {errors.password}
          </p>
        )}
      </div>

      <div className="login-options">
        <label className="remember-option">
          <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
          <span>Remember me</span>
        </label>
        <Link href="/forgot-password" className="text-link">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="login-submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
      {submitted && (
        <p className="form-status" role="status">
          Your details look good. You can continue.
        </p>
      )}
    </form>
  );
}
