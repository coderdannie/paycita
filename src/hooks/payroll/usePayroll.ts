import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import payslipService from "@/src/service/api/payslip.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";

export const useGetMyPayslip = (options?: { enabled?: boolean }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_MY_PAYSLIP],
    queryFn: async () => {
      const response = await payslipService.getMyPayslip();
      return response;
    },
    enabled: options?.enabled ?? true, // Allow disabling the query
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
    payslipData: data?.data?.data || [],
    rawData: data,
    pagination: data?.data?.pagination || {},
  };
};

export const useGetMyPension = (options?: { enabled?: boolean }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_MY_PENSION],
    queryFn: async () => {
      const response = await payslipService.getMyPension();
      return response;
    },
    enabled: options?.enabled ?? true,
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
    pensionData: data?.data?.data || [],
    rawData: data,
  };
};

export const useGetMyTax = (options?: { enabled?: boolean }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_MY_TAX],
    queryFn: async () => {
      const response = await payslipService.getMyTax();
      return response;
    },
    enabled: options?.enabled ?? true,
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
    taxData: data?.data?.data, // Adjust based on actual API response structure
    rawData: data,
  };
};

export const useGetSinglePayslip = (
  id: string,
  options?: { enabled?: boolean }
) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    // Include id in the query key
    queryKey: [QUERY_KEYS.GET_SINGLE_PAYSLIP, id],
    queryFn: async () => {
      const response = await payslipService.getSinglePayslip(id);
      return response;
    },
    // Only run the query if id is provided and enabled is true
    enabled: !!id && (options?.enabled ?? true),
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
    singlePayslipData: data?.data?.data || {}, // Adjust based on actual API response structure
    rawData: data,
  };
};

export const useGetPayRoll = (
  filters?: { page?: string },
  options?: { enabled?: boolean }
) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_PAYROLL, filters],
    queryFn: async () => {
      // Assuming getPayRoll accepts filters, adjust if not
      // const response = await payslipService.getPayRoll(filters);
      const response = await payslipService.getPayRoll();
      return response;
    },
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
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
    payrolls: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useGetPayRollByMonth = (
  payload: { date: string },
  options?: { enabled?: boolean }
) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    // Include payload in the query key for unique identification
    queryKey: [QUERY_KEYS.GET_PAYROLL_BY_MONTH, payload],
    queryFn: async () => {
      const response = await payslipService.getPayRollByMonth(payload);
      return response;
    },
    // Only run the query if date is provided and enabled is true
    enabled: !!payload?.date && (options?.enabled ?? true),
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
    payrollByMonthData: data?.data?.data,
    rawData: data,
  };
};

export const useGetSinglePayRoll = (
  id: string,
  options?: { enabled?: boolean }
) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_SINGLE_PAYROLL, id],
    queryFn: async () => {
      const response = await payslipService.getSinglePayRoll(id);
      return response;
    },
    enabled: !!id && (options?.enabled ?? true),
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
    singlePayrollData: data?.data?.data || {},
    rawData: data,
  };
};

export const useUploadPayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payrollData: FormData) => {
      const response = await payslipService.uploadPayroll(payrollData);
      return response;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to upload payroll";

        console.error("Payroll upload error:", errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error("Payroll upload error:", err);
        throw err;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PAYROLL_BY_MONTH],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PAYROLL],
        exact: false,
      });
    },
  });
};

export const useGetPayRollTax = (options?: { enabled?: boolean }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_PAYROLL_TAX],
    queryFn: async () => {
      const response = await payslipService.getPayRollTax();
      return response;
    },
    enabled: options?.enabled ?? true,
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
    payrollTaxData: data?.data?.data, // Adjust based on actual API response structure
    rawData: data,
  };
};
