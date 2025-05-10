import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError, AxiosResponse } from "axios";
import assetService from "@/src/service/api/asset-management.service";

const useGetAllAssets = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_ASSETS, filters],
    queryFn: async () => {
      const response = await assetService.getAllAssets(filters);

      return response;
    },
    placeholderData: keepPreviousData,
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

const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<{ message: string }>,
    Error,
    { name: string; category: string; quantity: number; status: string }
  >({
    mutationFn: (data: {
      name: string;
      category: string;
      quantity: number;
      status: string;
    }) => assetService.createAsset(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_ASSETS],
      });
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

const useAssignAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<{ message: string }>,
    Error,
    { asset_id: string; user_id: string }
  >({
    mutationFn: (data: { asset_id: string; user_id: string }) =>
      assetService.assignAsset(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_ASSETS],
      });
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

export {
  useGetAllAssets,
  useCreateAsset,
  useGetAllCategory,
  useGetAllUsers,
  useAssignAsset,
  useGetAllAssignedAssets,
};
