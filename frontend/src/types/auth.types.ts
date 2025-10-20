export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  cedula?: string;
  birthdate?: string | Date | null;
}

export interface AuthResponse {
  token?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  message?: string;
}

export interface AuthState {
  token?: string | null;
  user?: { email?: string; firstName?: string; lastName?: string } | null;
}
