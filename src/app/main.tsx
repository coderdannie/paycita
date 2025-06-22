"use client";
import React, { ReactNode, Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../Redux/store";
import GlobalProvider from "../context/appContext";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "../context/notificationContext";
import DashboardProvider from "../context/dashboardContext";
import AuthProvider from "../context/authContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { iPhoneDebug } from "../utils/iPhoneDebug";
import IPhoneDebugComponent from "../components/IPhoneDebugComponent";

import LoadingOverlay from "../components/common/LoadingOverlay";
import { Providers } from "./Providers";

const MainWrapper = ({ children }: { children: ReactNode }) => {
  // Debug iPhone issues on app startup
  React.useEffect(() => {
    iPhoneDebug.log("MainWrapper mounted");
    iPhoneDebug.checkEnvironment();
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingOverlay />}>
        <Provider store={store}>
          <PersistGate loading={<LoadingOverlay />} persistor={persistor}>
            <Providers>
              <GlobalProvider>
                <AuthProvider>
                  <NotificationProvider>                    <DashboardProvider>
                      <IPhoneDebugComponent />
                      <Toaster position="top-right" />
                      {children}
                    </DashboardProvider>
                  </NotificationProvider>
                </AuthProvider>
              </GlobalProvider>
            </Providers>
          </PersistGate>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default MainWrapper;
