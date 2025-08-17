import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { AxiosError } from 'axios';
import benefitMgtService from '@/src/service/api/benefit-mgt.service';
import { BenefitFormData } from '@/src/types/dashboard';
import toast from 'react-hot-toast';

export const useGetBenefits = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_BENEFITS, filters],
    queryFn: async () => {
      const response = await benefitMgtService.getBenefits(filters);
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
    isPending,
    benefits: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useAddBenefit = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateAddBenefit,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: BenefitFormData) => {
      const response = await benefitMgtService.addBenefit(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_BENEFITS],
      });
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      toast.error(error.response.data.message || 'Failed to add benefit');
    },
  });
  return {
    mutateAddBenefit,
    isPending,
    isSuccess,
    isError,
  };
};

export const useUpdateBenefit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id: string;
      benefit_name?: string;
      description?: string;
      benefit_type?: string;
      unit?: string;
      allocation?: string;
      recurring?: string;
    }) => benefitMgtService.updateBenefit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_BENEFITS],
      });
      toast.success('Benefit details updated successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update Benefit details'
      );
    },
  });
};

export const useDeleteBenefit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await benefitMgtService.deleteBenefit(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_BENEFITS], // ✅ correct key for benefits
      });
      toast.success('Benefit deleted successfully!');
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      toast.error(error.response?.data?.message || 'Failed to delete benefit');
    },
  });
};

export const useAssignBenefit = () => {
  const queryClient = useQueryClient();

  const {
    mutate: mutateAssignBenefit,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: {
      employee_id: string;
      benefit_ids: string[];
    }) => {
      const response = await benefitMgtService.assignBenefit(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
      });
      toast.success('Benefit assigned successfully!');
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      toast.error(error.response.data.message || 'Failed to assign benefit');
    },
  });

  return {
    mutateAssignBenefit,
    isPending,
    isSuccess,
    isError,
  };
};

export const useDeleteBenefitAssigned = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await benefitMgtService.deleteBenefitAssigned(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
      });
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      toast.error(error.response?.data?.message || 'Failed to delete benefit');
    },
  });
};
