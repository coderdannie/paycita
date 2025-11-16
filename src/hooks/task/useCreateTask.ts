import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  AddTask,
  createTask,
  CreateTaskPayload,
  getAllEmployees,
} from "@/src/service/api/task.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";

export interface CreateTaskResponse {
  status: number;
  success: boolean;
  message: string;
  data: unknown;
  pagination: unknown;
}

export type CreateTaskError = AxiosError<{
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}>;

export type UseCreateTaskOptions = UseMutationOptions<
  CreateTaskResponse,
  CreateTaskError,
  CreateTaskPayload
>;

export const useCreateTask = (options?: UseCreateTaskOptions) => {
  const queryClient = useQueryClient();

  return useMutation<CreateTaskResponse, CreateTaskError, CreateTaskPayload>({
    mutationKey: [QUERY_KEYS.CREATE_TASK],
    mutationFn: async (payload) => {
      const response = await AddTask(payload);
      return response.data as CreateTaskResponse;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TASKS] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      options?.onSettled?.(data, error, variables, context);
    },
  });
};

export const useGetAllEmployees = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_EMPLOYEES],
    queryFn: getAllEmployees,
    staleTime: 10 * 60 * 1000,
  });
};
