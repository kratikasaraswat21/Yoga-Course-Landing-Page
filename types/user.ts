export type LoginFormData = {
  email: string
  password: string
}

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>

export type SignupFormData = {
  fullName: string
  email: string
  password: string
  acceptedTerms: boolean
}

export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>

export type VerifyEmailFormData = {
  code: string
}

export type VerifyEmailFormErrors = Partial<Record<keyof VerifyEmailFormData, string>>

export type ForgotPasswordFormData = {
  email: string
}

export type ForgotPasswordFormErrors = Partial<Record<keyof ForgotPasswordFormData, string>>

export type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

export type ResetPasswordFormErrors = Partial<Record<keyof ResetPasswordFormData, string>>
