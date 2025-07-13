"use client";
import { createContext, useContext } from "react";
import useApiRequest from "../hooks/useApiRequest";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser, setToken } from "../Redux/features/authSlice";
import { LoginSchemaType } from "../utils/validations";
import { useAuthSelector } from "../Redux/selectors";
import { safeLocalStorage } from "../utils/safeLocalStorage";
import { iPhoneDebug } from "../utils/iPhoneDebug";

interface AuthContextType {
  handleLogin: (formData: LoginSchemaType) => void;
  isLogginIn: boolean;
  user: LoggedInUserProps | null;
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
  const authState = useAuthSelector();
  const user = authState.user;
  const handleLogin = async (formData: LoginSchemaType) => {
    iPhoneDebug.log("Starting login process", { email: formData.email });
    iPhoneDebug.checkEnvironment();

    return await postRequest(
      "/login",
      formData,
      (data: {
        success: boolean;
        data: { token: string; user: LoggedInUserProps };
      }) => {
        iPhoneDebug.log("Login response received", { success: data.success });

        if (data.success && data.data) {
          const token = data?.data?.token;
          const user = data?.data?.user;

          iPhoneDebug.log("Attempting to store token", {
            tokenLength: token?.length,
          });
          safeLocalStorage.setItem("access_token", token);
          dispatch(setToken(token));

          iPhoneDebug.log("Dispatching user data to Redux");
          dispatch(loginUser(user));

          iPhoneDebug.log("Navigating to dashboard");
          router.push("/dashboard");
        }
      }
    );
  };

  const value: AuthContextType = { handleLogin, isLogginIn, user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};

export default AuthProvider;
