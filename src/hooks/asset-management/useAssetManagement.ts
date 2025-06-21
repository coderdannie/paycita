import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosResponse } from "axios";
import assetService from "@/src/service/api/asset-management.service";

const useGetAllAssets = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_ASSETS, filters],
    queryFn: async () => {
      const response = await assetService.getAllAssets(filters);

      return response;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });

  const allAssets = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};
  return {
    isError,
    isSuccess,
    isPending,
    allAssets,
    pagination,
  };
};

const useCreateAsset = (
  options?: UseMutationOptions<
    AxiosResponse<{ message: string }>,
    Error,
    { name: string; category: string; quantity: number; status: string }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => assetService.createAsset(data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_ASSETS],
      });
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
};
const useGetAllCategory = () => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_ASSET_CATEGORY],
    queryFn: async () => {
      const response = await assetService.getAllCategory();

      return response;
    },
  });

  const categories = data?.data?.data || [];
  return {
    isError,
    isSuccess,
    isPending,
    categories,
  };
};

const useGetAllUsers = () => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USERS],
    queryFn: async () => {
      const response = await assetService.getAllUsers();

      return response;
    },
  });

  const users = data?.data?.data || [];
  return {
    isError,
    isSuccess,
    isPending,
    users,
  };
};

const useAssignAsset = (
  options?: UseMutationOptions<
    AxiosResponse<{ message: string }>,
    Error,
    { asset_id: string; user_id: string }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { asset_id: string; user_id: string }) =>
      assetService.assignAsset(data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_ASSETS],
      });
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
};

const useGetAllAssignedAssets = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_ASSIGNED_ASSETS, filters],
    queryFn: async () => {
      const response = await assetService.getAllAssignedAssets(filters);

      return response;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });

  const assignedAssets = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};
  return {
    isError,
    isSuccess,
    isPending,
    assignedAssets,
    pagination,
  };
};

export const useRevokeAssets = (options = {}) => {
  const {
    mutate,
    isPending: isLoading,
    data,
  } = useMutation({
    mutationFn: assetService.revokeAssets,
    ...options,
  });

  return { mutate, isLoading, data };
};

export {
  useGetAllAssets,
  useCreateAsset,
  useGetAllCategory,
  useGetAllUsers,
  useAssignAsset,
  useGetAllAssignedAssets,
};
