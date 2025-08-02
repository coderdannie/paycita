import queryMgtService from '@/src/service/api/query-mgt.service';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { CommentData, EmployeeQuery } from '@/src/types/queryMgt';
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetAllQuery = (filters?: {
  page: string;
  query_title?: string;
  priority?: string;
  department?: string;
}) => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_QUERY, filters],
    queryFn: async () => {
      const response = await queryMgtService.getAllQuery(filters);
      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  const allQuery = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  return {
    allQuery,
    isSuccess,
    isError,
    isPending,
    pagination,
  };
};

export const useAddQuery = () => {
  return useMutation({
    mutationFn: async (queryData: EmployeeQuery) => {
      const response = await queryMgtService.addQuery(queryData);
      return response;
    },
  });
};

export const useGetAllUsers = () => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_QUERY],
    queryFn: async () => {
      const response = await queryMgtService.getAllUsers();
      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  const allUsers = data?.data?.data || [];

  return {
    allUsers,
    isSuccess,
    isError,
    isPending,
  };
};

export const useDeleteQuery = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateDeleteQuery,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await queryMgtService.deleteQuery(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_QUERY],
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
    mutateDeleteQuery,
    isPending,
    isSuccess,
    isError,
  };
};

export const useGetQueryDetails = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_QUERY_DETAILS, id],
    queryFn: async () => {
      const response = await queryMgtService.getQueryDetails(id);
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
    queryDetails: data?.data?.data || null,
    rawData: data,
  };
};

export const useAddComment = () => {
  return useMutation({
    mutationFn: async (queryData: CommentData) => {
      const response = await queryMgtService.addComment(queryData);
      return response;
    },
  });
};

export const useUpdateQueryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; data: { status: string } }) => {
      const response = await queryMgtService.updateQueryStatus(
        data.id,
        data.data
      );
      return response;
    },
    onError: (err) => {
      // Handle errors
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Failed to update query status';
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_QUERY_DETAILS],
        exact: false,
      });

      // Also invalidate the specific query detail
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_QUERY_DETAILS, variables.id],
      });
    },
  });
};