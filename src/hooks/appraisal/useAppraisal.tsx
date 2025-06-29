import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import appraisalService, {
  AssessmentData,
} from '@/src/service/api/appraisal.service';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { AxiosError, AxiosResponse } from 'axios';
import { AppraisalFormValues } from '@/src/types/appraisal';

export const useGetAppraisals = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_APPRAISALS, filters],
    queryFn: async () => {
      const response = await appraisalService.getAppraisals(filters);
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
    appraisals: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useTakeAssessment = () => {
  return useMutation<AxiosResponse<AssessmentData>, Error, AssessmentData>({
    mutationFn: (data: AssessmentData) => appraisalService.takeAssessment(data),
  });
};

export const useCreateAppraisal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppraisalFormValues) => {
      const response = await appraisalService.createAppraisals(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_APPRAISALS],
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
};

export const useGetSingleAppraisal = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_SINGLE_APPRAISAL, id],
    queryFn: async () => {
      const response = await appraisalService.getAppraisalsById(id);
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
    appraisal: data?.data?.data || null,
    rawData: data,
  };
};

export const useGetDepartmentDetails = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_All_APPRAISAL_BY_DEPARTMENT, id],
    queryFn: async () => {
      const response = await appraisalService.getAllAppraisalsByDepartment(id);
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
    appraisalDepartmentDetails: data?.data?.data || null,
    rawData: data,
  };
};

export const useGetAppraisalsByDepartment = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_APPRAISAL_BY_DEPARTMENT, id],
    queryFn: async () => {
      const response = await appraisalService.getAppraisalsByDepartment(id);
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
    appraisalByDepartment: data?.data?.data || null,
    rawData: data,
  };
};
