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
    mutationFn: (data: {
      amount: string;
      phone_number: string;
      network: string;
    }) => billPaymentService.buyAirtime(data),
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

interface ElectricityProvider {
  service_provider_code?: string;
  code?: string;
  service_provider?: string;
  name?: string;
}

type ElectricityProviderList = ElectricityProvider[] | ElectricityProvider[][];

export const useGetElectricityProviders = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery<
    AxiosResponse<{ data: ElectricityProviderList }>,
    AxiosError
  >({
    queryKey: [QUERY_KEYS.GET_ELECTRICITY_PROVIDERS],
    queryFn: async () => billPaymentService.getElectricityProviders(),
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    staleTime: 10 * 60 * 1000,
  });

  // Normalize providers into a flat { code, name }[] list
  const rawData = data?.data?.data as ElectricityProviderList | undefined;
  const raw = rawData ?? [];
  const inner = Array.isArray(raw)
    ? Array.isArray(raw[0])
      ? (raw[0] as ElectricityProvider[])
      : (raw as ElectricityProvider[])
    : [];
  const providers = Array.isArray(inner)
    ? inner.map((p: ElectricityProvider) => ({
        // Ensure these are strings to match Material Tailwind Select expectations
        code: String(p?.service_provider_code ?? p?.code ?? ""),
        name: String(p?.service_provider ?? p?.name ?? ""),
      }))
    : [];

  return {
    isError,
    isSuccess,
    isLoading: isPending,
    isFetching,
    providers,
    rawData: data,
  };
};

export const useValidateElectricityNumber = () => {
  return useMutation<
    AxiosResponse<{ message: string; token?: string }>,
    Error,
    {
      meter_number: string;
      meter_type: "prepaid" | "postpaid" | string;
      amount: string;
      service_provider_code: string;
    }
  >({
    mutationFn: (payload) =>
      billPaymentService.validateElectricityNumber(payload),
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404)
        return false;
      // Allow exactly one retry on non-404 errors
      return failureCount < 0;
    },
  });
};

export const useBuyElectricity = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<{ message: string; token?: string }>,
    Error,
    {
      meter_number: string;
      meter_type: "prepaid" | "postpaid" | string;
      amount: string;
      service_provider_code: string;
      customer_name: string;
      // wallet_pin: string;
    }
  >({
    mutationFn: (payload) => billPaymentService.buyElectricity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TRANSACTION_HISTORY],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 404) return;
    },
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404)
        return false;
      return failureCount < 1;
    },
  });
};
