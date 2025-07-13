import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export interface TokenInfo {
  isExpired: boolean;
  isExpiringSoon: boolean;
  timeUntilExpiry: number;
  shouldRenew: boolean;
}

interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export const checkTokenStatus = (
  token: string,
  bufferMinutes: number = 5
): TokenInfo => {
  try {
    let cleanToken = token?.trim();
    if (cleanToken?.startsWith("Bearer ")) {
      cleanToken = cleanToken.substring(7).trim();
    }

    const decoded: JwtPayload = jwtDecode(cleanToken);

    if (!decoded.exp) {
      return {
        isExpired: false,
        isExpiringSoon: false,
        timeUntilExpiry: 0,
        shouldRenew: false,
      };
    }

    const currentTime = dayjs();
    const tokenExpiration = dayjs.unix(decoded.exp);
    const timeUntilExpiry = tokenExpiration.diff(currentTime, "minute");

    const isExpired = currentTime.isAfter(tokenExpiration);
    const isExpiringSoon =
      timeUntilExpiry <= bufferMinutes && timeUntilExpiry > 0;
    const shouldRenew = isExpired || isExpiringSoon;

    return {
      isExpired,
      isExpiringSoon,
      timeUntilExpiry,
      shouldRenew,
    };
  } catch {
    return {
      isExpired: true,
      isExpiringSoon: false,
      timeUntilExpiry: 0,
      shouldRenew: true,
    };
  }
};

export const triggerSessionRenewal = (source: string = "unknown") => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("session-expired", {
      detail: { source },
    });
    window.dispatchEvent(event);
  }
};

export const getTokenExpirationInfo = (token: string) => {
  try {
    let cleanToken = token?.trim();
    if (cleanToken?.startsWith("Bearer ")) {
      cleanToken = cleanToken.substring(7).trim();
    }

    const decoded: JwtPayload = jwtDecode(cleanToken);
    if (!decoded.exp) return null;

    const currentTime = dayjs();
    const tokenExpiration = dayjs.unix(decoded.exp);

    return {
      currentTime: currentTime.format(),
      tokenExpiration: tokenExpiration.format(),
      timeUntilExpiry: tokenExpiration.diff(currentTime, "minute"),
      isExpired: currentTime.isAfter(tokenExpiration),
    };
  } catch {
    return null;
  }
};

export interface RouteChangeConfig {
  enabled: boolean;
  bufferMinutes: number;
  excludedRoutes: string[];
  debugMode: boolean;
}

export const DEFAULT_ROUTE_CONFIG: RouteChangeConfig = {
  enabled: true,
  bufferMinutes: 5,
  excludedRoutes: [
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
  ],
  debugMode: process.env.NODE_ENV === "development",
};

export const shouldSkipRouteCheck = (
  route: string,
  config: RouteChangeConfig = DEFAULT_ROUTE_CONFIG
): boolean => {
  if (!config.enabled) {
    return true;
  }

  return config.excludedRoutes.some((excludedRoute) =>
    route.startsWith(excludedRoute)
  );
};

export const checkTokenOnRouteChangeWithConfig = (
  token: string,
  fromRoute: string,
  toRoute: string,
  config: Partial<RouteChangeConfig> = {}
) => {
  const finalConfig = { ...DEFAULT_ROUTE_CONFIG, ...config };

  if (shouldSkipRouteCheck(toRoute, finalConfig)) {
    return null;
  }

  return checkTokenOnRouteChange(
    token,
    fromRoute,
    toRoute,
    finalConfig.bufferMinutes
  );
};

export const checkTokenOnRouteChange = (
  token: string,
  fromRoute: string,
  toRoute: string,
  bufferMinutes: number = 5
) => {
  const tokenStatus = safeCheckTokenStatus(token, bufferMinutes);
  const cleanToken = extractCleanToken(token);
  const tokenInfo = cleanToken ? getTokenExpirationInfo(cleanToken) : null;

  if (tokenStatus.shouldRenew) {
    triggerSessionRenewal(`Route change: ${fromRoute} → ${toRoute}`);
  }

  return {
    ...tokenStatus,
    tokenInfo,
    route: { from: fromRoute, to: toRoute },
  };
};

export const extractCleanToken = (
  token: string | null | undefined
): string | null => {
  if (!token || typeof token !== "string") {
    return null;
  }

  let cleanToken = token.trim();
  if (cleanToken.startsWith("Bearer ")) {
    cleanToken = cleanToken.substring(7).trim();
  }

  const parts = cleanToken.split(".");
  if (parts.length !== 3) {
    return null;
  }

  if (parts.some((part) => !part || part.length === 0)) {
    return null;
  }

  return cleanToken;
};

export const safeCheckTokenStatus = (
  token: string | null | undefined,
  bufferMinutes: number = 5
): TokenInfo => {
  const cleanToken = extractCleanToken(token);

  if (!cleanToken) {
    return {
      isExpired: true,
      isExpiringSoon: false,
      timeUntilExpiry: 0,
      shouldRenew: true,
    };
  }

  return checkTokenStatus(cleanToken, bufferMinutes);
};
