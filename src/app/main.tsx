"use client";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../Redux/store";
import GlobalProvider from "../context/appContext";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "../service/tanstack-query/queryProvider";

const MainWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider>
          <GlobalProvider>
            <Toaster />
            {children}
          </GlobalProvider>
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
};

export default MainWrapper;
