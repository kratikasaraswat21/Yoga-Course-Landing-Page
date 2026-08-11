export type LoginFormData = {
  email: string
  password: string
}

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>
