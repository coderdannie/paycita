"use client";
import { createContext, useContext } from "react";

interface GlobalContextType {}

export const GlobalContext = createContext<GlobalContextType | undefined>(
	undefined
);

const GlobalProvider = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const value: GlobalContextType = {};
	return (
		<GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
	);
};

export const useGlobalContext = () => {
	return useContext(GlobalContext) as GlobalContextType;
};

export default GlobalProvider;
