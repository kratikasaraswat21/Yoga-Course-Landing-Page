"use client"

import { FormEvent, useState } from "react"
import { LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { useDebounce } from "@/hooks/useDebounce"
import { multipleApiHandler } from "@/lib/api/multiple.api"
import { validateForgotPasswordForm } from "@/lib/validation/auth.validation"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitForgotPassword = useDebounce(async (formEmail: string) => {
    try {
      const response = await multipleApiHandler([
        {
          endPoint: "/auth/forgot-password",
          method: "POST",
          data: { email: formEmail.trim() },
        },
      ])
      const res = response[0]

      if (!res?.data?.success) {
        toast.add({ title: "Reset link not sent", description: res?.data?.message ?? "Please try again.", type: "error" })
        return
      }

      setSubmitted(true)
      toast.add({ title: "Reset link sent", description: "Check your email for password reset instructions.", type: "success" })
    } catch {
      toast.add({ title: "Reset link not sent", description: "Please try again.", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateForgotPasswordForm({ email })
    setError(nextErrors.email)
    setSubmitted(false)

    if (nextErrors.email) return

    setIsSubmitting(true)
    submitForgotPassword(email)
  }

  return (
    <form className="mt-12 flex w-full flex-col gap-7" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="forgot-password-email">Registered email address</label>
        <Input
          id="forgot-password-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setError(undefined)
            setSubmitted(false)
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "forgot-password-email-error" : undefined}
          className={error ? "login-input input-error" : "login-input"}
        />
        {error && (
          <p id="forgot-password-email-error" className="field-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" className="login-submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending reset link…" : "Send reset link"}
      </Button>

      <div className="flex items-center gap-3 text-sm leading-6 text-[#66716D]">
        <LockKeyhole className="size-5 shrink-0" aria-hidden="true" />
        <p className="m-0">For your security, the reset link will expire in 10 minutes.</p>
      </div>

      {submitted && (
        <p className="-mt-3 text-sm text-[#3F7A5A]" role="status">
          If an account exists for this email, we’ll send a reset link shortly.
        </p>
      )}
    </form>
  )
}
