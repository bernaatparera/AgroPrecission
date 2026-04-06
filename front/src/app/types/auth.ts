// Definir interfaces (DTOs)

export interface RegisterRequest {
  username: string; // email
  password: string;
  nombre: string;
  apellidos: string;
}

export interface RegisterResponse {
  message: string;
}

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  activo: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}