"use client";
import React, { ReactNode, Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../Redux/store";
import GlobalProvider from "../context/appContext";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "../service/tanstack-query/queryProvider";
import LoadingOverlay from "../components/common/LoadingOverlay";

const MainWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <Provider store={store}>
        <PersistGate loading={<LoadingOverlay />} persistor={persistor}>
          <QueryProvider>
            <GlobalProvider>
              <Toaster position="top-right" />
              {children}
            </GlobalProvider>
          </QueryProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  );
};

export default MainWrapper;
