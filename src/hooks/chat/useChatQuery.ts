import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import chatService from "@/src/service/api/chat.service";
 
import { AxiosError } from "axios";
// import { playSentSound } from "@/src/utils/audio";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";

export const useGetAllChat = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_CHAT],
    queryFn: async () => {
      const response = await chatService.getAllChat();
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
    allChats: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useInitiateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatData: { user_2_id: string }) => {
      const response = await chatService.initializeChat(chatData);
      return response.data; // Make sure we're returning the response data
    },
    onMutate: async (newChat) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
      });

      const previousChat = queryClient.getQueryData([QUERY_KEYS.GET_ALL_CHAT]);

      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_CHAT],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: { data: { data: any[] } }) => {
          const newData = { ...old };
          if (newData?.data?.data) {
            newData.data.data = [newChat, ...newData.data.data];
          }
          return newData;
        }
      );

      return { previousChat };
    },
    onError: (err, newChat, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_CHAT],
        context?.previousChat
      );

      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to create chat";
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
        exact: false,
      });
    },
  });
};

export const useComposeChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatData: ComposeChat) => {
      const response = await chatService.composeChat(chatData);
      // playSentSound();
      return response;
    },
    onSuccess: (response, variables) => {
      // Immediately invalidate the cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SINGLE_CHAT, variables.chat_id],
      });
      
      // Also invalidate the chat list to update last message
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_CHAT],
      });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    }
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
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
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

export const useGetAllColleagues = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_COLLEAGUES],
    queryFn: async () => {
      const response = await chatService.getAllColleagues();
      return response;
    },
    retry: (
      failureCount,
      error: {
        response: {
          status: number;
        };
      }
    ) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false; // Do not retry on 404 errors
      }
      return failureCount < 2; // Retry up to 2 times for other errors
    },
  });

  return {
    isError,
    isSuccess,
    isLoading: isPending && !isFetching,
    isFetching,
    colleagues: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};
