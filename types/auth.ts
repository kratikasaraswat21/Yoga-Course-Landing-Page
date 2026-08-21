export interface VerifiedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  deletedAt?: string | null;
}

export interface VerifyUserResponse {
  success: boolean;
  message?: string;
  data?: { user_info?: VerifiedUser };
}
