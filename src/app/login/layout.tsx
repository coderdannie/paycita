import AuthProvider from "@/src/context/authContext";
import React from "react";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
	return <AuthProvider>{children}</AuthProvider>;
};

export default LoginLayout;
