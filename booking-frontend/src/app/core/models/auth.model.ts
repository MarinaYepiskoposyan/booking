import { User } from './user.model';

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CLIENT' | 'PROVIDER';
}

export interface LoginRequest {
  email: string;
  password: string;
}
