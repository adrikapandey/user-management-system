import { apiClient } from "./client.js";

export async function loginRequest(payload) {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
}

export async function getMeRequest(token) {
  const response = await apiClient.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

export async function refreshTokenRequest(refreshToken) {
  const response = await apiClient.post("/auth/refresh", { refreshToken });
  return response.data;
}
