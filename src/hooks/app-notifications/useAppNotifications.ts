import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError } from "axios";

import appNotificationService from "@/src/service/api/app-notification.service";

export const useGetAppNotifications = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_APP_NOTIFICATIONS],
    queryFn: async () => {
      const response = await appNotificationService.getAllNotifications();
      return response;
    },
    placeholderData: keepPreviousData,
    // Only retry on server errors, not 404s
    retry: (
      failureCount,
      error: {
        response: {
          status: number;
        };
      }
    ) => {
      if (error instanceof AxiosError && error.response?.status === 404)
        return false;
      return failureCount < 2;
    },
    // refetch after 1 minute
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    isError,
    isSuccess,
    isLoading: isPending && !isFetching,
    isFetching,
    appNotifications: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useDeleteAppNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await appNotificationService.deleteNotification(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_APP_NOTIFICATIONS],
      });
    },
  });
};
export const useDeleteAllAppNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await appNotificationService.deleteAllNotifications();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_APP_NOTIFICATIONS],
      });
    },
  });
};
