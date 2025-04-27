import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import approvalService from "@/src/service/api/approvals.service";

// --- Query Hooks ---

/**
 * Hook to fetch all approvals for a specific route.
 * @param route - The specific approval route (e.g., 'leave', 'expense').
 * @param filters - Optional filters (e.g., { page: '1', status: 'pending' }).
 */
export const useGetAllApprovals = (
  route: string,
  filters?: Record<string, string>
) => {
  const queryKey = [QUERY_KEYS.GET_ALL_APPROVALS, route, filters];
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await approvalService.getAllApprovals(
        route /*, filters */
      );
      return response;
    },
    placeholderData: keepPreviousData,
    enabled: !!route,
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
    approvals: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

 
export const useAddApprovalComment = (route: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { thread_id: string; comment: string }) => {
      const response = await approvalService.addApprovalComment(route, data);
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SINGLE_PROCUREMENT, variables.thread_id],
      });
    },
    onError: (error) => {
      console.error("Error adding approval comment:", error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Failed to add comment";
        throw new Error(errorMessage);
      }
      throw error;
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SINGLE_PROCUREMENT, variables.thread_id],
        exact: false,
      });
    },
  });
};

 
export const useUpdateApproval = (route: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      id: string;
      data: { status: string; reason: string };
    }) => {
      const { id, data } = variables;
      const response = await approvalService.updateApproval(route, id, data);
      return response;
    },
 
    onMutate: async (updatedApprovalData) => {
      const { id } = updatedApprovalData;
      const listQueryKey = [QUERY_KEYS.GET_ALL_APPROVALS, route]; // Adjust filters if needed
      const detailQueryKey = [QUERY_KEYS.GET_ALL_APPROVALS, id];

      // Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      await queryClient.cancelQueries({ queryKey: detailQueryKey });

      // Snapshot previous values
      const previousApprovalList = queryClient.getQueryData(listQueryKey);
      const previousApprovalDetail = queryClient.getQueryData(detailQueryKey);

      // Optimistically update detail view
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(detailQueryKey, (old: any) => {
        if (!old) return old; 
        return {
          ...old,
          data: { ...old.data, status: updatedApprovalData.data.status },
        };
      });

      // Optimistically update list view
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(listQueryKey, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: old.data.data.map((item: any) =>
              item.id === id
                ? { ...item, status: updatedApprovalData.data.status }
                : item
            ),
          },
        };
      });

      return {
        previousApprovalList,
        previousApprovalDetail,
        listQueryKey,
        detailQueryKey,
      };
    },
    onError: (err, _variables, context) => {
      // Rollback on error
      if (context?.previousApprovalList) {
        queryClient.setQueryData(
          context.listQueryKey,
          context.previousApprovalList
        );
      }
      if (context?.previousApprovalDetail) {
        queryClient.setQueryData(
          context.detailQueryKey,
          context.previousApprovalDetail
        );
      }

      console.error("Error updating approval:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to update approval";
        throw new Error(errorMessage);
      }
      throw err;
    },
    onSettled: (_data, _error, _variables, context) => { 
      queryClient.invalidateQueries({
        queryKey: context?.listQueryKey,
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: context?.detailQueryKey });
    },
  });
};

export const useResolveCommentThread = (route: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<{ message?: string }> | Error, string>(
    {
      mutationFn: async (threadId: string): Promise<unknown> => {
        const response = await approvalService.resolveCommentThread(
          route,
          threadId
        );
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS],
        });
      },
      onError: (
        error: AxiosError<{ message?: string }> | Error,
        threadId: string
      ) => {
        console.error(`Error resolving comment thread ${threadId}:`, error);
        if (error instanceof AxiosError && error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else if (error instanceof Error) {
          throw new Error(error.message || "Failed to resolve comment thread");
        }
        throw new Error(
          "An unknown error occurred while resolving the comment thread."
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS],
          exact: false,
        });
      },
    }
  );
};
