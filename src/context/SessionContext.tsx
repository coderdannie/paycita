"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

import { usePathname } from "next/navigation";
import { useAuthSelector } from "../Redux/selectors";
import { safeCheckTokenStatus } from "../utils/tokenUtils";
import { safeLocalStorage } from "../utils/safeLocalStorage";
import SessionExpiredModal from "../components/modals/SessionExpiredModal";

interface SessionContextType {
  isSessionExpired: boolean;
  showSessionModal: boolean;
  handleSessionExpired: () => void;
  handleSessionRenewed: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [previousUser, setPreviousUser] = useState<LoggedInUserProps | null>(
    null
  );
  const [loginTimestamp, setLoginTimestamp] = useState<number | null>(null);

  const { token, isLoggedIn, user } = useAuthSelector();
  const pathname = usePathname();

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
  const isExcludedRoute = excludedRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  useEffect(() => {
    if (isExcludedRoute) {
      setIsSessionExpired(false);
      setShowSessionModal(false);
      return;
    }

    if (isLoggedIn && token) {
      // Check if this is a fresh login (grace period of 2 minutes)
      const now = Date.now();
      const isRecentLogin =
        loginTimestamp && now - loginTimestamp < 2 * 60 * 1000; // 2 minutes

      const tokenStatus = safeCheckTokenStatus(token, 5);

      if (
        isRecentLogin &&
        tokenStatus.isExpiringSoon &&
        !tokenStatus.isExpired
      ) {
        setIsSessionExpired(false);
        setShowSessionModal(false);
        setWasAuthenticated(true);
        setPreviousUser(user);
        return;
      }

      if (tokenStatus.shouldRenew) {
        setIsSessionExpired(true);
        setShowSessionModal(true);
      } else {
        setWasAuthenticated(true);
        setPreviousUser(user);

        setIsSessionExpired(false);
        setShowSessionModal(false);
      }
    } else if (!isLoggedIn) {
      setIsSessionExpired(false);
      setShowSessionModal(false);
      setWasAuthenticated(false);
      setPreviousUser(null);
      setLoginTimestamp(null);

      if (typeof window !== "undefined") {
        const storedToken = safeLocalStorage.getItem("access_token");
        if (storedToken && !isExcludedRoute) {
          safeLocalStorage.removeItem("access_token");
        }
      }
    }
  }, [token, isLoggedIn, isExcludedRoute, pathname, loginTimestamp, user]);

  useEffect(() => {
    if (isLoggedIn && token && (!wasAuthenticated || previousUser !== user)) {
      setLoginTimestamp(Date.now());
    }
  }, [token, isLoggedIn, wasAuthenticated, previousUser, user]);

  useEffect(() => {
    if (!isLoggedIn || !token || isExcludedRoute) return;

    const checkTokenExpiration = () => {
      if (isExcludedRoute) return;

      if (token) {
        const tokenStatus = safeCheckTokenStatus(token, 5); // 5 minutes buffer
        if (tokenStatus.shouldRenew) {
          setIsSessionExpired(true);
          setShowSessionModal(true);
        }
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, isLoggedIn, isExcludedRoute]);

  useEffect(() => {
    if (isExcludedRoute) {
      return;
    }

    if (isLoggedIn && token) {
      setWasAuthenticated(true);
      setPreviousUser(user);
    }

    if (wasAuthenticated && !isLoggedIn && previousUser && !isExcludedRoute) {
      setIsSessionExpired(true);
      setShowSessionModal(true);
    }
  }, [
    isLoggedIn,
    wasAuthenticated,
    token,
    previousUser,
    isExcludedRoute,
    user,
  ]);

  useEffect(() => {
    const handleSessionExpiredEvent = () => {
      if (isExcludedRoute) {
        return;
      }

      if (isLoggedIn && token) {
        const tokenStatus = safeCheckTokenStatus(token, 5);

        if (tokenStatus.shouldRenew && !showSessionModal) {
          setIsSessionExpired(true);
          setShowSessionModal(true);
        }
      }
    };

    window.addEventListener("session-expired", handleSessionExpiredEvent);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpiredEvent);
    };
  }, [isLoggedIn, token, showSessionModal, isExcludedRoute]);

  const handleSessionExpired = () => {
    setIsSessionExpired(true);
    setShowSessionModal(true);
  };

  const handleSessionRenewed = () => {
    setIsSessionExpired(false);
    setShowSessionModal(false);

    setWasAuthenticated(isLoggedIn);

    if (isLoggedIn) {
      setLoginTimestamp(Date.now());
    }
  };

  return (
    <SessionContext.Provider
      value={{
        isSessionExpired,
        showSessionModal,
        handleSessionExpired,
        handleSessionRenewed,
      }}
    >
      {children}

      {!isExcludedRoute && isLoggedIn && (
        <SessionExpiredModal
          isOpen={showSessionModal}
          onClose={handleSessionRenewed}
        />
      )}
    </SessionContext.Provider>
  );
};
