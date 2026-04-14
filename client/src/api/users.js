import { apiClient } from "./client.js";

function authConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

export async function getUsersRequest(token, params) {
  const response = await apiClient.get("/users", {
    ...authConfig(token),
    params
  });

  return response.data;
}

export async function createUserRequest(token, payload) {
  const response = await apiClient.post("/users", payload, authConfig(token));
  return response.data;
}

export async function updateUserRequest(token, userId, payload) {
  const response = await apiClient.patch(`/users/${userId}`, payload, authConfig(token));
  return response.data;
}

export async function deactivateUserRequest(token, userId) {
  const response = await apiClient.delete(`/users/${userId}`, authConfig(token));
  return response.data;
}

export async function getUserRequest(token, userId) {
  const response = await apiClient.get(`/users/${userId}`, authConfig(token));
  return response.data;
}

export async function getProfileRequest(token) {
  const response = await apiClient.get("/users/me", authConfig(token));
  return response.data;
}

export async function updateProfileRequest(token, payload) {
  const response = await apiClient.patch("/users/me", payload, authConfig(token));
  return response.data;
}
