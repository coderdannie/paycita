import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import chatService from "@/src/service/api/chat.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError } from "axios";

export const useGetAllChat = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_CHAT, filters],
    queryFn: async () => {
      const response = await chatService.getAllChat(filters);
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
  });

  return {
    isError,
    isSuccess,
    isLoading: isPending && !isFetching, // Distinguish between initial load and background refresh
    isFetching,
    chats: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useInitiateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatData: Chat) => {
      const response = await chatService.initializeChat(chatData);
      return response;
    },
    onMutate: async (newChat) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
      });

      // Snapshot the previous value
      const previousChat = queryClient.getQueryData([QUERY_KEYS.GET_ALL_CHAT]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_CHAT],
        (old: {
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any[];
          };
        }) => {
          const newData = { ...old };
          if (newData?.data?.data) {
            newData.data.data = [newChat, ...newData.data.data];
          }
          return newData;
        }
      );

      // Return a context object with the snapshotted value
      return { previousChat };
    },
    onError: (err, newChat, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_CHAT],
        context?.previousChat
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to create chat";
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
        exact: false, // Invalidate all variants
      });
    },
  });
};

export const useComposeChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatData: ComposeChat) => {
      const response = await chatService.composeChat(chatData);
      return response;
    },
    onMutate: async (newChat) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
      });

      // Snapshot the previous value
      const previousChat = queryClient.getQueryData([QUERY_KEYS.GET_ALL_CHAT]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_CHAT],
        (old: {
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any[];
          };
        }) => {
          const newData = { ...old };
          if (newData?.data?.data) {
            newData.data.data = [newChat, ...newData.data.data];
          }
          return newData;
        }
      );

      // Return a context object with the snapshotted value
      return { previousChat };
    },
    onError: (err, newChat, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_CHAT],
        context?.previousChat
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to create chat";
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
        exact: false, // Invalidate all variants
      });
    },
  });
};

export const useGetSingleChat = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_SINGLE_CHAT, id],
    enabled: !!id,
    queryFn: async () => {
      const response = await chatService.getSingleChat(id);
      return response;
    },

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
  });

  return {
    isError,
    isSuccess,
    isLoading: isPending && !isFetching,
    isFetching,
    singleChat: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useDeleteChatRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      const response = await chatService.deleteChat(chatId);
      return response;
    },
    onMutate: async (chatId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
      });

      // Snapshot the previous value
      const previousChat = queryClient.getQueryData([QUERY_KEYS.GET_ALL_CHAT]);

      // Optimistically remove the chat from cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_CHAT],
        (old: {
          data: {
            data: Array<{ id: string }>;
            pagination?: Pagination;
          };
        }) => {
          if (!old?.data?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.filter((chat) => chat.id !== chatId),
              // Adjust pagination if needed
              pagination: old.data.pagination
                ? {
                    ...old.data.pagination,
                    totalItems: old.data.pagination.total_records - 1,
                    totalPages: Math.ceil(
                      (old.data.pagination.total_records - 1) /
                        old.data.pagination.per_page
                    ),
                  }
                : undefined,
            },
          };
        }
      );

      // Return context for rollback
      return { previousChat, deletedChatId: chatId };
    },
    onError: (err, chatId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_CHAT],
        context?.previousChat
      );

      // Enhanced error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || `Failed to delete chat ${chatId}`;
        throw new Error(errorMessage);
      }
      throw err;
    },
    onSettled: (data, error, chatId) => {
      // Invalidate both the list and the specific chat query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EVENT_BY_ID, chatId],
      });
    },
  });
};
