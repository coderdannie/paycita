import { logoutUser } from "@/src/service/api/logout.service";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useLogOut = () => {
  const queryClient = useQueryClient();
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

      // Remove all queries from the cache
      queryClient.removeQueries();

      // Clear localStorage
      localStorage.clear();

      // Cancel any ongoing queries
      queryClient.cancelQueries();

      // Reset the query client to clear any in-memory cache
      queryClient.clear();

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      toast.error(error.response.data.message || "Failed to logout");
    },
  });
  return {
    mutateLogOut,
    isPending,
    isSuccess,
    isError,
  };
};
