import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import leaveService from '@/src/service/api/leave.service';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';

import { LeaveRequestSchemaType } from '@/src/utils/validations';

export const useGetAllLeave = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_LEAVE, filters],
    queryFn: async () => {
      const response = await leaveService.getAllLeave(filters);

      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  const leave = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};
  return {
    isError,
    isSuccess,
    isPending,
    leave,
    pagination,
  };
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateCreateLeave,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: LeaveRequestSchemaType) => {
      const response = await leaveService.createLeave(data);
      return response;
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.GET_ALL_LEAVE, 'pending-leave-requests'],
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
    mutateCreateLeave,
    isPending,
    isSuccess,
    isError,
  };
};

export const useGetEmployeeLeave = (filters?: {
  page: string;
  employee_name?: string;
  status?: string;
  leave_type?: string;
}) => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_EMPLOYEE_LEAVE, filters],
    queryFn: async () => {
      const response = await leaveService.getEmployeeLeave(filters);
      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  const employeeLeave = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  return {
    employeeLeave,
    isSuccess,
    isError,
    isPending,
    pagination,
  };
};

export const useUpdateEmployeeLeave = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateUpdateEmployeeLeave,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: {
      id: string;
      status: string;
      comment?: string;
    }) => {
      const response = await leaveService.updateLeaveRequests(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EMPLOYEE_LEAVE],
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
    mutateUpdateEmployeeLeave,
    isPending,
    isSuccess,
    isError,
  };
};

export const useDeleteLeaveRequest = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateDeleteLeaveRequest,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await leaveService.deleteLeaveRequest(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EMPLOYEE_LEAVE],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_LEAVE],
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
    mutateDeleteLeaveRequest,
    isPending,
    isSuccess,
    isError,
  };
};
