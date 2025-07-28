import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import loanService from '@/src/service/api/loan.service';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { AxiosError } from 'axios';
import { Loan, LoanPolicyData } from '@/src/types/loan';

export const useGetAllLoan = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_LOAN, filters],
    queryFn: async () => {
      const response = await loanService.getAllLoan(filters);
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
    loans: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useRequestLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanData: Loan) => {
      const response = await loanService.createLoan(loanData);
      return response;
    },
    onMutate: async (newLoan) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_LOAN],
      });

      // Snapshot the previous value
      const previousLoan = queryClient.getQueryData([QUERY_KEYS.GET_ALL_LOAN]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_LOAN],
        (old: {
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any[];
          };
        }) => {
          const newData = { ...old };
          if (newData?.data?.data) {
            newData.data.data = [newLoan, ...newData.data.data];
          }
          return newData;
        }
      );

      // Return a context object with the snapshotted value
      return { previousLoan };
    },
    onError: (err, newLoan, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_LOAN],
        context?.previousLoan
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Failed to create loan';
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_LOAN],
        exact: false, // Invalidate all variants
      });
    },
  });
};

export const useDeleteLoanRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanId: string) => {
      const response = await loanService.deleteLoan(loanId);
      return response;
    },
    onMutate: async (loanId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_LOAN],
      });

      // Snapshot the previous value
      const previousLoan = queryClient.getQueryData([QUERY_KEYS.GET_ALL_LOAN]);

      // Optimistically remove the loan from cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_LOAN],
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
              data: old.data.data.filter((loan) => loan.id !== loanId),
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
      return { previousLoan, deletedLoanId: loanId };
    },
    onError: (err, loanId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_LOAN],
        context?.previousLoan
      );

      // Enhanced error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || `Failed to delete loan ${loanId}`;
        throw new Error(errorMessage);
      }
      throw err;
    },
    onSettled: (data, error, loanId) => {
      // Invalidate both the list and the specific loan query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_LOAN],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EVENT_BY_ID, loanId],
      });
    },
  });
};

export const useGetRepaymentPeriod = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_REPAYMENT_PERIOD],
    queryFn: async () => {
      const response = await loanService.getRepaymentPeriod();
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
    repaymentPeriod: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useGetLoanType = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_LOAN_TYPE],
    queryFn: async () => {
      const response = await loanService.getLoanType();
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
    loanType: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useGetLoanTypeDetails = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_LOAN_TYPE_DETAILS, id],
    queryFn: async () => {
      const response = await loanService.getLoanTypeDetails(id);
      return response;
    },
    enabled: !!id,
    placeholderData: keepPreviousData,

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
    loanTypeDetails: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useGetLoanHistory = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_LOAN_HISTORY, id],
    queryFn: async () => {
      const response = await loanService.getLoanHistory(id);
      return response;
    },
    enabled: !!id,
    placeholderData: keepPreviousData,

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
    loanHistory: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useCreateLoanPolicy = () => {
  return useMutation({
    mutationFn: async (loanData: LoanPolicyData) => {
      const response = await loanService.createLoanPolicy(loanData);
      return response;
    },
  });
};

export const useDeleteLoanPolicy = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateDeleteLoanPolicy,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await loanService.deleteLoanPolicy(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_LOAN_POLICY],
      });
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {},
  });
  return {
    mutateDeleteLoanPolicy,
    isPending,
    isSuccess,
    isError,
  };
};

export const useGetAllLoanPolicy = () => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_LOAN_POLICY],
    queryFn: async () => {
      const response = await loanService.getAllLoanPolicy();

      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  const loanPolicy = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};
  return {
    isError,
    isSuccess,
    isPending,
    loanPolicy,
    pagination,
  };
};

export const useGetAllLoanRequest = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_LOAN_REQUEST, filters],
    queryFn: async () => {
      const response = await loanService.getAllLoanRequest(filters);

      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  const loanRequests = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};
  return {
    isError,
    isSuccess,
    isPending,
    loanRequests,
    pagination,
  };
};

export const useGetLoanRepaymentHistoryById = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_LOAN_REPAYMENT_HISTORY, id],
    queryFn: async () => {
      const response = await loanService.getLoanRepaymentHistoryById(id);
      return response;
    },
    enabled: !!id,
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
    history: data?.data?.data || null,
    rawData: data,
  };
};
