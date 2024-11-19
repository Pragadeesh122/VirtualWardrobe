export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  userName?: string;
  email?: string;
  uid?: string;
}

export interface RegisterData extends LoginCredentials {
  userName?: string;
}

export interface RegisterResponse {
  success: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

export interface PasswordResetRequest {
  email: string;
}
