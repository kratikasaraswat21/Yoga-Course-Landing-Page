import type {
  LoginFormData,
  LoginFormErrors,
  SignupFormData,
  SignupFormErrors,
  VerifyEmailFormData,
  VerifyEmailFormErrors,
  ForgotPasswordFormData,
  ForgotPasswordFormErrors,
  ResetPasswordFormData,
  ResetPasswordFormErrors,
} from "@/types/user"

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

export function validateSignupForm(values: SignupFormData): SignupFormErrors {
  const errors: SignupFormErrors = {}
  const fullName = values.fullName.trim()
  const email = values.email.trim()
  const password = values.password.trim()

  if (!fullName) errors.fullName = "Please enter your full name."
  if (!email) errors.email = "Please enter your email address."
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Please enter a valid email address."
  if (!password) errors.password = "Please create a password."
  else if (password.length < 6 || password.length > 50) errors.password = "Password must contain 6–50 characters."
  if (!values.acceptedTerms) errors.acceptedTerms = "Please agree to the Terms of Service and Privacy Policy."

  return errors
}

export function validateVerifyEmailForm(values: VerifyEmailFormData): VerifyEmailFormErrors {
  const errors: VerifyEmailFormErrors = {}
  const code = values.code.trim()

  if (!code) errors.code = "Please enter the verification code."
  else if (!/^\d{6}$/.test(code)) errors.code = "Enter the 6-digit verification code."

  return errors
}

export function validateForgotPasswordForm(values: ForgotPasswordFormData): ForgotPasswordFormErrors {
  const errors: ForgotPasswordFormErrors = {}
  const email = values.email.trim()

  if (!email) errors.email = "Please enter your email address."
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Please enter a valid email address."

  return errors
}

export function validateResetPasswordForm(values: ResetPasswordFormData): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {}
  const password = values.password.trim()
  const confirmPassword = values.confirmPassword.trim()

  if (!password) errors.password = "Please enter a new password."
  else if (password.length < 6 || password.length > 100) errors.password = "Password must contain 6–100 characters."

  if (!confirmPassword) errors.confirmPassword = "Please confirm your new password."
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match."

  return errors
}
