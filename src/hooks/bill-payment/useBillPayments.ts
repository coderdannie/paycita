import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError, AxiosResponse } from "axios";
import billPaymentService from "@/src/service/api/bill-payment.service";

export const useGetTransactionHistory = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_TRANSACTION_HISTORY, filters],
    queryFn: async () => {
      const response = await billPaymentService.getTransactionHistory(filters);
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
    isLoading: isPending && !isFetching,
    isFetching,
    transactionHistory: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useBuyAirtime = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<{ message: string }>,
    Error,
    { amount: string; phone_number: string; network: string }
  >({
    mutationFn: (data: { amount: string; phone_number: string; network: string }) =>
      billPaymentService.buyAirtime(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TRANSACTION_HISTORY],
      });
    },
    onError: (error: AxiosError) => {
      if (error instanceof AxiosError && error.response?.status === 404) return;
    },
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404)
        return false;
      return failureCount < 2;
    },
    mutationKey: [QUERY_KEYS.GET_TRANSACTION_HISTORY],
  });
};

export const useBuyData = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<{ message: string }>,
    Error,
    {
      network_id: string;
      recipient: string;
      plan_id: string;
    }
  >({
    mutationFn: (data: {
      network_id: string;
      recipient: string;
      plan_id: string;
    }) => billPaymentService.buyData(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TRANSACTION_HISTORY],
      });
    },
    onError: (error: AxiosError) => {
      if (error instanceof AxiosError && error.response?.status === 404) return;
    },
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404)
        return false;
      return failureCount < 2;
    },
    mutationKey: [QUERY_KEYS.GET_TRANSACTION_HISTORY],
  });
};

export const useGetNetworkDataPlans = (network: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_NETWORK_DATA_PLANS, network],
    enabled: !!network,
    queryFn: async () => {
      const response = await billPaymentService.getNetworkDataPlans(network);
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
    networkDataPlans: data?.data?.data?.network?.plans || [],
    rawData: data,
  };
};
