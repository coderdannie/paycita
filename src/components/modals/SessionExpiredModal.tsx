"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { z } from "zod";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import { safeLocalStorage } from "@/src/utils/safeLocalStorage";
import { loginUser, setToken } from "@/src/Redux/features/authSlice";
import { useAuthSelector } from "@/src/Redux/selectors";
import { useLogOut } from "@/src/hooks/useLogOut";
import { useSignInUser } from "@/src/hooks/auth/useAuth";

interface SessionRenewalFormData {
  password?: string;
}

const sessionRenewalSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionExpiredModal({
  isOpen,
  onClose,
}: SessionExpiredModalProps) {
  const dispatch = useDispatch();
  const { user } = useAuthSelector();

  const { mutate: loginMutate, isPending } = useSignInUser();
  const { mutateLogOut: logout } = useLogOut();

  const loginForm = useForm<SessionRenewalFormData>({
    resolver: zodResolver(sessionRenewalSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleFullLogout = () => {
    logout();
  };

  const onLoginSubmit = (data: SessionRenewalFormData) => {
    if (!user?.email) {
      toast.error("User information not found. Please refresh and try again.");

      return;
    }

    const payload = {
      email: user.email,
      password: data.password,
    };

    loginMutate(payload, {
      onSuccess: (res) => {
        safeLocalStorage.setItem("access_token", res.data.data.token);
        dispatch(setToken(res.data.data.token));
        dispatch(loginUser(res.data.data.user));

        onClose();
        loginForm.reset();
        toast.success("Session renewed successfully");
      },
      onError: (error: AxiosError) => {
        const errorMessage =
          (error?.response?.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data
            ? (error.response.data as { message?: string }).message
            : undefined) || "Failed to renew session. Please try again.";
        toast.error(errorMessage);
      },
    });
  };

  const getInitials = (fullName?: string) => {
    if (fullName) {
      const names = fullName.trim().split(/\s+/);
      if (names.length === 1) {
        return names[0].slice(0, 2).toUpperCase();
      }
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return "U";
  };

  const initials = getInitials(user?.full_name);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <DialogTitle className="flex flex-col gap-1 items-center">
            <div className="text-xl font-bold text-amber-600">
              ⏰ Session Expired
            </div>
            <span className="text-gray-600 font-normal text-sm">
              Your session has expired. Please enter your password to continue.
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="pb-6">
          {/* User Information Display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex flex-row items-center gap-3">
              {/* Custom Avatar */}
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  {`${user?.full_name}`.trim()}
                </span>
                <span className="text-gray-600">{user?.email}</span>
                <span className="text-gray-500 capitalize">
                  {user?.role?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-4"
          >
            <div>
              <input
                {...loginForm.register("password")}
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border-2 text-[#34006A] bg-white
                  border-[#E4E7EC] rounded-md focus:outline-none focus:ring-0 focus:border-purple-500"
              />
              {loginForm.formState.errors.password && (
                <span className="text-red-500 text-sm mt-1 block">
                  {loginForm.formState.errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors duration-200"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Continue"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              onClick={handleFullLogout}
              disabled={isPending}
            >
              Logout Instead
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
