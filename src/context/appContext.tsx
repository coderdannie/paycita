"use client";
import { createContext, useContext } from "react";

interface GlobalContextType {
  // Define any global state or functions here
  // For example:
  user: null;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

const GlobalProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const value: GlobalContextType = {
	// Initialize any global state or functions here
	user: null,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext) as GlobalContextType;
};

export default GlobalProvider;
