import type { LoginFormData, LoginFormErrors } from "@/types/user"

export function validateLoginForm(values: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {}
  const email = values.email.trim()
  const password = values.password.trim()

  if (!email) errors.email = "Please enter your email address."
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Please enter a valid email address."

  if (!password) errors.password = "Please enter your password."
  else if (password.length < 6) errors.password = "Password must be at least 6 characters."

  return errors
}
