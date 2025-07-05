import axios from "axios";
import Router from "next/router";
import { safeLocalStorage } from "../../utils/safeLocalStorage";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const handleUnauthorizedError = (error) => {
  if (axios.isAxiosError(error) && error.response) {
    if (error.response.status === 401) {
      // Safe localStorage clear for iPhone/Safari
      safeLocalStorage.clear();

      // Use window.location.href as fallback for better iPhone compatibility
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        // Fallback for SSR
        Router.push("/login");
      }

      return Promise.reject(new Error("Unauthorized, redirecting to login."));
    }
  }
  // For any other errors, just reject the promise so they can be handled
  // by the calling code's .catch() block
  return Promise.reject(error);
};

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api2 = axios.create({
  baseURL,
  // Don't set Content-Type for multipart/form-data - let browser set it with boundary
});

api.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use((response) => {
  return response;
}, handleUnauthorizedError);

api2.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api2.interceptors.response.use((response) => {
  return response;
}, handleUnauthorizedError);
