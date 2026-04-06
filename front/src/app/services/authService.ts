import { AuthUser, LoginRequest, RegisterRequest, TokenResponse } from "../types/auth";
import { apiRequest } from "./apiClient";

export const getMe = async (token: string): Promise<AuthUser> => {
  return apiRequest("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const registerUser = async (data: RegisterRequest) => {
  return apiRequest("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const loginUser = async (data: LoginRequest): Promise<TokenResponse> => {
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);

  return apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
};