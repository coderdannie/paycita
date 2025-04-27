import walletService from "@/src/service/api/wallet.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetWalletHistory = (filters?: Record<string, string>) => {
  const queryKey = [QUERY_KEYS.GET_WALLET_HISTORY, filters];
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await walletService.getWalletHistory();
      return response;
    },
    placeholderData: keepPreviousData,

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
    wallet: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useRequestFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { amount: string; reason: string }) => {
      const response = await walletService.requestFunds(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_WALLET_HISTORY],
      });
    },
  });
};
