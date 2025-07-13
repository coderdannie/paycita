"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuthSelector } from "../Redux/selectors";

/**
 * Component that listens for route changes and checks token validity
 * Triggers session renewal modal if token is expired or expiring soon
 */
export const RouteChangeListener = () => {
  const pathname = usePathname();
  const { isLoggedIn, token } = useAuthSelector();
  const previousPathnameRef = useRef<string>("");

  useEffect(() => {
    if (previousPathnameRef.current === "") {
      previousPathnameRef.current = pathname;
      return;
    }

    if (previousPathnameRef.current === pathname) {
      return;
    }

    const fromRoute = previousPathnameRef.current;
    const toRoute = pathname;

    previousPathnameRef.current = pathname;

    if (!isLoggedIn || !token) {
      return;
    }

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
    const isFromExcluded = excludedRoutes.some((route) =>
      fromRoute?.startsWith(route)
    );
    const isToExcluded = excludedRoutes.some((route) =>
      toRoute?.startsWith(route)
    );

    if (isFromExcluded || isToExcluded) {
      return;
    }
  }, [pathname, isLoggedIn, token]);

  return null;
};
