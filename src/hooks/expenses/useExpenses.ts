import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { AxiosError } from 'axios';
import expenseService from '@/src/service/api/expenses.service';
import { Expenses } from '@/src/types/procurement';

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
        [QUERY_KEYS.GET_ALL_EXPENSES],
        context?.previousExpenses
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Failed to create event';
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate and refetch after either success or error
      // Invalidate the list query more broadly to catch different filter variations
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_EXPENSES],
        exact: false, // Ensures all queries starting with GET_ALL_EXPENSES are invalidated
      });
      // Also invalidate the specific single expense query if needed elsewhere or for the detail view
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SINGLE_EXPENSE, variables.id],
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
        queryKey: [QUERY_KEYS.GET_ALL_EXPENSES],
      });

      // Snapshot the previous value
      const previousExpenses = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_EXPENSES,
      ]);

      // Optimistically remove the event from cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_EXPENSES],
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
        [QUERY_KEYS.GET_ALL_EXPENSES],
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
        queryKey: [QUERY_KEYS.GET_ALL_EXPENSES],
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
    queryKey: [QUERY_KEYS.GET_ALL_EXPENSE_TYPES],
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
    queryKey: [QUERY_KEYS.GET_SINGLE_EXPENSE, id],
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
    isPending,
    expense: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useResolveExpensesCommentThread = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<{ message?: string }> | Error, string>(
    {
      mutationFn: async (threadId: string): Promise<unknown> => {
        const response = await expenseService.resolveExpensesCommentThread(
          threadId
        );
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_SINGLE_EXPENSE],
        });
      },
      onError: (
        error: AxiosError<{ message?: string }> | Error,
        threadId: string
      ) => {
        if (error instanceof AxiosError && error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else if (error instanceof Error) {
          throw new Error(error.message || 'Failed to resolve comment thread');
        }
        throw new Error(
          'An unknown error occurred while resolving the comment thread.'
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_SINGLE_EXPENSE],
          exact: false,
        });
      },
    }
  );
};

export const useUpdateExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; data: Expenses }) => {
      const response = await expenseService.updateExpenses(data.id, data.data);
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
            newData.data.data = [
              newExpense.data,
              ...newData.data.data.filter(
                (expense) => expense.id !== newExpense.id
              ),
            ];
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
        [QUERY_KEYS.GET_ALL_EXPENSES],
        context?.previousExpenses
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Failed to create event';
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate and refetch after either success or error
      // Invalidate the list query more broadly to catch different filter variations
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_EXPENSES],
        exact: false, // Ensures all queries starting with GET_ALL_EXPENSES are invalidated
      });
      // Also invalidate the specific single expense query if needed elsewhere or for the detail view
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SINGLE_EXPENSE, variables.id],
      });
    },
  });
};

export const useGetAllProcurements = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_PROCUREMENTS, filters],
    queryFn: async () => {
      const response = await expenseService.getAllProcurements(filters);
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
    isLoading: isPending,
    isFetching,
    procurements: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useGetAllPurchaseExpenses = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_EXPENSES, filters],
    queryFn: async () => {
      const response = await expenseService.getAllPurchaseExpenses(filters);
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
    isLoading: isPending,
    isFetching,
    expenses: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useGetAllReimbursements = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_REIMBURSEMENTS, filters],
    queryFn: async () => {
      const response = await expenseService.getAllReimbursements(filters);
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
    isLoading: isPending,
    isFetching,
    reimbursements: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};
