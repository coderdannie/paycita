import { useCallback } from "react";
import { useAuthSelector } from "../Redux/selectors";
import {
  checkTokenStatus,
  safeCheckTokenStatus,
  triggerSessionRenewal,
} from "../utils/tokenUtils";
import { safeLocalStorage } from "../utils/safeLocalStorage";

export const useTokenCheck = () => {
  const { token, isLoggedIn } = useAuthSelector();

  const checkAndHandleToken = useCallback(
    (source: string = "API call", bufferMinutes: number = 5): boolean => {
      if (!isLoggedIn || !token) {
        return false;
      }

      const tokenStatus = checkTokenStatus(token, bufferMinutes);

      if (tokenStatus.shouldRenew) {
        triggerSessionRenewal(source);

        return !tokenStatus.isExpired;
      }

      return true;
    },
    [token, isLoggedIn]
  );

  return {
    checkAndHandleToken,
    hasValidToken: isLoggedIn && !!token,
    userToken: token,
  };
};

export const withTokenCheck = <
  TArgs extends readonly unknown[],
  TReturn
>(
  apiCall: (...args: TArgs) => Promise<TReturn>,
  source: string = "API call"
) => {
  return (...args: TArgs): Promise<TReturn> => {
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
      return apiCall(...args);
    }

    const token = safeLocalStorage.getItem("access_token");
    if (token) {
      const tokenStatus = safeCheckTokenStatus(token);
      if (tokenStatus.shouldRenew) {
        triggerSessionRenewal(source);
        
        // Allow API calls to continue even if token is expired
        // Session renewal modal will handle the user interaction
        // The API call may fail with 401, but that will trigger the modal
      }
    }

    return apiCall(...args);
  };
};
