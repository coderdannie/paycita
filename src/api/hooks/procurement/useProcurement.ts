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
      const previousEvents = queryClient.getQueryData([
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
      return { previousEvents };
    },
    onError: (err, newProcurement, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        context?.previousEvents
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

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await procurementService.deleteProcurement(eventId);
      return response;
    },
    onMutate: async (eventId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS],
      });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData([
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
              data: old.data.data.filter((event) => event.id !== eventId),
              // Adjust pagination if needed
              pagination: old.data.pagination
                ? {
                    ...old.data.pagination,
                    totalItems: old.data.pagination.total_pages - 1,
                    totalPages: Math.ceil(
                      (old.data.pagination.total_pages - 1) /
                        old.data.pagination.per_page
                    ),
                  }
                : undefined,
            },
          };
        }
      );

      // Return context for rollback
      return { previousEvents, deletedEventId: eventId };
    },
    onError: (err, eventId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        context?.previousEvents
      );

      // Enhanced error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || `Failed to delete event ${eventId}`;
        throw new Error(errorMessage);
      }
      throw err;
    },
    onSettled: (data, error, eventId) => {
      // Invalidate both the list and the specific event query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROCUREMENTS_BY_ID, eventId],
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
