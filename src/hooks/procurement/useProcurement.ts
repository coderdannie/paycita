import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import procurementService from "@/src/service/api/procurement.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError } from "axios";
import { Procurement } from "@/src/types/procurement";

export const useGetAllProcurements = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS, filters],
    queryFn: async () => {
      const response = await procurementService.getAllProcurements(filters);
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
    procurements: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useCreateProcurements = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Procurement) => {
      const response = await procurementService.createProcurements(data);
      return response;
    },
    onMutate: async (newProcurement) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS],
      });

      // Snapshot the previous value
      const previousProcurements = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_PROCUREMENTS,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        (old: {
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any[];
          };
        }) => {
          const newData = { ...old };
          if (newData?.data?.data) {
            newData.data.data = [newProcurement, ...newData.data.data];
          }
          return newData;
        }
      );

      // Return a context object with the snapshotted value
      return { previousProcurements };
    },
    onError: (err, newProcurement, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        context?.previousProcurements
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to create event";
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        exact: false, // Invalidate all variants
      });
    },
  });
};

export const useDeleteProcurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await procurementService.deleteProcurement(id);
      return response;
    },
    onMutate: async (procurementId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS],
      });

      // Snapshot the previous value
      const previousProcurements = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_PROCUREMENTS,
      ]);

      // Optimistically remove the event from cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROCUREMENTS],
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
              data: old.data.data.filter((event) => event.id !== procurementId),
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
      return { previousProcurements, deletedEventId: procurementId };
    },
    onError: (err, procurementId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        context?.previousProcurements
      );

      // Enhanced error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message ||
          `Failed to delete event ${procurementId}`;
        throw new Error(errorMessage);
      }
      throw err;
    },
    onSettled: (data, error, procurementId) => {
      // Invalidate both the list and the specific event query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROCUREMENTS_BY_ID, procurementId],
      });
    },
  });
};

export const useGetVendors = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_VENDORS],
    queryFn: async () => {
      const response = await procurementService.getVendors();
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
    isLoading: isPending && !isFetching, // Distinguish between initial load and background refresh
    isFetching,
    vendors: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useGetSingleProcurement = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_SINGLE_PROCUREMENT, id],
    enabled: !!id,
    queryFn: async () => {
      const response = await procurementService.getSingleProcurement(id);
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
    procurement: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useResolveProcurementCommentThread = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<{ message?: string }> | Error, string>(
    {
      mutationFn: async (threadId: string): Promise<unknown> => {
        const response =
          await procurementService.resolveProcurementCommentThread(threadId);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_SINGLE_PROCUREMENT],
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
          queryKey: [QUERY_KEYS.GET_SINGLE_PROCUREMENT],
          exact: false,
        });
      },
    }
  );
};
