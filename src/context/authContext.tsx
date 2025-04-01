"use client";
import { createContext, useContext } from "react";
import useApiRequest from "../api/hooks/useApiRequest";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser } from "../Redux/features/authSlice";

interface AuthContextType {
	handleLogin: (formData: LoginDataProps) => void;
	isLogginIn: boolean;
	
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

const AuthProvider = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const { postRequest, loading: isLogginIn } = useApiRequest();
	const dispatch = useDispatch();
	const router = useRouter();

	const handleLogin = async (formData: LoginDataProps) =>
		await postRequest("/login", formData, (data) => {
			console.log(data);
			if (data.success) {
				const token = data.data.token;
				const user = data.data.user;
				localStorage.setItem("access_token", token);
				dispatch(loginUser(user));
				router.push("/dashboard");
			}
		});

	const value: AuthContextType = { handleLogin, isLogginIn };
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext) as AuthContextType;
};

export default AuthProvider;
