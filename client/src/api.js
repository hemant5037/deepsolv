import axios from "axios";

const normalizeApiBaseUrl = (value) => {
  if (!value) return "/api";
  const trimmed = value.replace(/\/$/, "");
  if (trimmed === "/api" || trimmed.endsWith("/api")) {
    return trimmed;
  }
  return `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
