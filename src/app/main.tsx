"use client";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../Redux/store";
import GlobalProvider from "../context/appContext";
import { Toaster } from "react-hot-toast";

const MainWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<GlobalProvider>
					<Toaster />
					{children}
				</GlobalProvider>
			</PersistGate>
		</Provider>
	);
};

export default MainWrapper;
