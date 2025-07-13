import {
  forgotPassword,
  resetPassword,
  signInUser,
} from "@/src/service/api/auth.service";
import { useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onError: (error: AxiosError) => {
      console.error("Forgot password error:", error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: {
      otp: string;
      password: string;
      confirm_password: string;
    }) => resetPassword(data),
    onError: (error: AxiosError) => {
      console.error("Reset password error:", error);
    },
  });
};

export const useSignInUser = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => signInUser(data),
    onError: (error: AxiosError) => {
      console.error("Sign in error:", error);
    },
  });
};
