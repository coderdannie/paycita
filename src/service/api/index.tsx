import axios from "axios";
// import Router from "next/router";
import { safeLocalStorage } from "../../utils/safeLocalStorage";
import {
  safeCheckTokenStatus,
  triggerSessionRenewal,
} from "@/src/utils/tokenUtils";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// const handleUnauthorizedError = (error) => {
//   if (axios.isAxiosError(error) && error.response) {
//     if (error.response.status === 401) {
//       // Safe localStorage clear for iPhone/Safari
//       safeLocalStorage.clear();

//       // Use window.location.href as fallback for better iPhone compatibility
//       if (typeof window !== "undefined") {
//         window.location.href = "/login";
//       } else {
//         // Fallback for SSR
//         Router.push("/login");
//       }

//       return Promise.reject(new Error("Unauthorized, redirecting to login."));
//     }
//   }
//   // For any other errors, just reject the promise so they can be handled
//   // by the calling code's .catch() block
//   return Promise.reject(error);
// };

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

// Special API instance for authentication/token renewal - bypasses token validation
// This instance is specifically used for login and renewal endpoints that should
// work even when the main token is expired. It prevents infinite loops during renewal.
export const authApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      const excludedRoutes = [
        "/login",
        "/register",
        "/forget-password",
        "/forgot-password",
        "/reset-password",
        "/new-password",
        "/otp-confirmation",
        "/signup",
        "/kyc",
        "/mail-sent-successful",
      ];
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const isExcludedRoute = excludedRoutes.some((route) =>
        currentPath?.startsWith(route)
      );

      if (isExcludedRoute) {
        return config;
      }

      const tokenStatus = safeCheckTokenStatus(token, 5);

      if (tokenStatus.shouldRenew) {
        triggerSessionRenewal("API interceptor (api)");

        // STRICT MODE: Reject all requests when token is expired
        // Only allow token renewal requests through authApi
        return Promise.reject(
          new Error("Token expired. Please renew your session.")
        );
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Trigger session renewal for 401 errors
      triggerSessionRenewal("API response interceptor (api)");

      // Reject the request since token is expired and only renewal should proceed
      return Promise.reject(
        new Error("Token expired. Please renew your session.")
      );
    }
    return Promise.reject(error);
  }
);

api2.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      const excludedRoutes = [
        "/login",
        "/register",
        "/forget-password",
        "/forgot-password",
        "/reset-password",
        "/new-password",
        "/otp-confirmation",
        "/signup",
        "/kyc",
        "/mail-sent-successful",
      ];
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const isExcludedRoute = excludedRoutes.some((route) =>
        currentPath?.startsWith(route)
      );

      if (isExcludedRoute) {
        return config;
      }

      const tokenStatus = safeCheckTokenStatus(token, 5);

      if (tokenStatus.shouldRenew) {
        triggerSessionRenewal("API interceptor (api2)");

        // STRICT MODE: Reject all requests when token is expired
        // Only allow token renewal requests through authApi
        return Promise.reject(
          new Error("Token expired. Please renew your session.")
        );
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api2.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Trigger session renewal for 401 errors
      triggerSessionRenewal("API response interceptor (api2)");

      // Reject the request since token is expired and only renewal should proceed
      return Promise.reject(
        new Error("Token expired. Please renew your session.")
      );
    }
    return Promise.reject(error);
  }
);

// Auth API interceptors - specifically designed for login/renewal operations
// These interceptors do NOT validate or reject based on token expiration
// to prevent infinite loops during the renewal process
authApi.interceptors.request.use(
  (config) => {
    // For login/renewal, we may need to send the expired token for validation
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

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't trigger session renewal from auth API calls to prevent loops
    return Promise.reject(error);
  }
);
