import { logoutUser } from "@/src/service/api/logout.service";
import { safeLocalStorage } from "../utils/safeLocalStorage";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useLogOut = () => {
  const queryClient = useQueryClient();

  const performClientSideLogout = () => {
    // Remove all queries from the cache
    queryClient.removeQueries();

    // Clear localStorage
    safeLocalStorage.clear();

    // Cancel any ongoing queries
    queryClient.cancelQueries();

    // Reset the query client to clear any in-memory cache
    queryClient.clear();

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  const {
    mutate: mutateLogOut,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async () => {
      const response = await logoutUser();
      return response;
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "Logout Successfully");
      performClientSideLogout();
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      // Even if server logout fails, still perform client-side cleanup
      // User wants to logout regardless of server response
      console.warn(
        "Server logout failed, performing client-side logout:",
        error
      );
      toast.error("Logout completed");
      performClientSideLogout();
    },
  });

  return {
    mutateLogOut,
    isPending,
    isSuccess,
    isError,
  };
};
