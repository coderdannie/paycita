import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
 
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError } from "axios"; 
import expenseService from "@/src/service/api/expenses.service";
import { Expenses } from "@/src/types/procurement";

export const useGetAllExpenses = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_EXPENSES, filters],
    queryFn: async () => {
      const response = await expenseService.getAllExpenses(filters);
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
    expenses: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useCreateExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Expenses) => {
      const response = await expenseService.createExpenses(data);
      return response;
    },
    onMutate: async (newExpense) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_EXPENSES],
      });

      // Snapshot the previous value
      const previousExpenses = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_EXPENSES,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_EXPENSES],
        (old: {
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any[];
          };
        }) => {
          const newData = { ...old };
          if (newData?.data?.data) {
            newData.data.data = [newExpense, ...newData.data.data];
          }
          return newData;
        }
      );

      // Return a context object with the snapshotted value
      return { previousExpenses };
    },
    onError: (err, newExpense, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        context?.previousExpenses
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

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await expenseService.deleteExpenses(id);
      return response;
    },
    onMutate: async (expenseId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS],
      });

      // Snapshot the previous value
      const previousExpenses = queryClient.getQueryData([
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
              data: old.data.data.filter((event) => event.id !== expenseId),
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
      return { previousExpenses, deletedEventId: expenseId };
    },
    onError: (err, expenseId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        context?.previousExpenses
      );

      // Enhanced error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || `Failed to delete event ${expenseId}`;
        throw new Error(errorMessage);
      }
      throw err;
    },
    onSettled: (data, error, expenseId) => {
      // Invalidate both the list and the specific event query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROCUREMENTS_BY_ID, expenseId],
      });
    },
  });
};

export const useGetExpenseTypes = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_VENDORS],
    queryFn: async () => {
      const response = await expenseService.getExpenseType();
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
    expenseType: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useGetSingleExpense = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_SINGLE_PROCUREMENT, id],
    enabled: !!id,
    queryFn: async () => {
      const response = await expenseService.getSingleExpenses(id);
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
    expense: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};
