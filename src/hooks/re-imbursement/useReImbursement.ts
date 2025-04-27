import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import reimbursementService, {
  Reimbursement,
} from "@/src/service/api/re-imbursement.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError } from "axios";

export const useGetAllReimbursements = (filters: {
  page: string;
  title: string;
}) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_REIMBURSEMENTS, filters],
    queryFn: async () => {
      const response = await reimbursementService.getAllReimbursements(filters);
      return response;
    },
    placeholderData: keepPreviousData,
    retry: (failureCount, error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  return {
    isError,
    isSuccess,
    isLoading: isPending && !isFetching,
    isFetching,
    reimbursements: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};

export const useCreateReimbursement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReimbursementData: FormData) => {
      const response = await reimbursementService.createReimbursement(
        newReimbursementData
      );
      return response;
    },
    onMutate: async (newReimbursement) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_REIMBURSEMENTS],
      });

      const previousReimbursements = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_REIMBURSEMENTS,
      ]);

      interface ReimbursementListResponse {
        data?: {
          data: Reimbursement[];
          pagination?: Pagination; //
        };
      }

      queryClient.setQueryData<ReimbursementListResponse | undefined>(
        [QUERY_KEYS.GET_ALL_REIMBURSEMENTS],
        (
          old: ReimbursementListResponse | undefined
        ): ReimbursementListResponse | undefined => {
          const newData: ReimbursementListResponse = { ...old };

          if (newData.data?.data) {
            newData.data = { ...newData.data };

            const optimisticReimbursement: Reimbursement = {
              ...newReimbursement,
              id: `temp-${Date.now()}`,
              status: "Pending",
            } as unknown as Reimbursement;

            newData.data.data = [optimisticReimbursement, ...newData.data.data];
          }

          return newData;
        }
      );

      // Return context
      return { previousReimbursements };
    },
    onError: (err, newReimbursement, context) => {
      if (context?.previousReimbursements) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_ALL_REIMBURSEMENTS],
          context.previousReimbursements
        );
      }

      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || "Failed to create reimbursement"
          : err.message || "An unexpected error occurred";
      console.error("Error creating reimbursement:", errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_REIMBURSEMENTS],
      });
    },
  });
};

export const useGetReimbursementById = (id: string) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_REIMBURSEMENT_BY_ID, id],
    queryFn: async () => {
      const response = await reimbursementService.getReimbursementById(id);
      return response;
    },
    enabled: !!id,
    placeholderData: keepPreviousData,
    retry: (failureCount, error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  return {
    isError,
    isSuccess,
    isLoading: isPending && !isFetching,
    isFetching,
    reimbursement: data?.data?.data || {},
  };
};
