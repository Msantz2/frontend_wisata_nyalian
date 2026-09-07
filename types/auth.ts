export interface AuthSession {
  userId: 'admin';
  issuedAt: number;
  expiresAt: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export interface AuthConfig {
  username: string;
  passwordHash: string;
}

export interface AuthUser {
  username: string;
  loginAt: Date;
  expiresAt: Date;
}
