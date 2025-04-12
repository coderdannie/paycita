import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import settingsService from "@/src/service/api/settings.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError } from "axios";

export const useGetAllProfileSettings = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
    queryFn: async () => {
      const response = await settingsService.getAllProfileSettings();
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
    profile: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pictureData: FormData) => {
      const response = await settingsService.updateProfilePicture(pictureData);
      return response.data; // Return the actual response data
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
      });

      const previousProfile = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_PROFILE,
      ]);

      return { previousProfile };
    },
    onSuccess: (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData([QUERY_KEYS.GET_ALL_PROFILE], (oldData: any) => {
        return {
          ...oldData,
          data: {
            ...oldData?.data,
            profile_picture: data.profile_picture,
          },
        };
      });
    },
    onError: (err, newProfile, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_ALL_PROFILE],
          context.previousProfile
        );
      }

      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to update profile picture";
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
      });
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passwordData: {
      old_password: string;
      new_password: string;
    }) => {
      const response = await settingsService.changePassword(passwordData);
      return response;
    },
    onMutate: async (newProfile) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
      });

      // Snapshot the previous value
      const previousChat = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_PROFILE,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROFILE],
        (old: {
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any[];
          };
        }) => {
          const newData = { ...old };
          if (newData?.data?.data) {
            newData.data.data = [newProfile, ...newData.data.data];
          }
          return newData;
        }
      );

      // Return a context object with the snapshotted value
      return { previousChat };
    },
    onError: (err, newProfile, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROFILE],
        context?.previousChat
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to create chat";
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
        exact: false, // Invalidate all variants
      });
    },
  });
};
export const useAddResumptionDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumptionData: {
      resumption_time: string;
      closing_time: string;
    }) => {
      const response = await settingsService.addResumptionDate(resumptionData);
      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
      });

      const previousProfile = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_PROFILE,
      ]);

      return { previousProfile };
    },
    onError: (err, newProfile, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_PROFILE],
        context?.previousProfile
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to create chat";
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
        exact: false, // Invalidate all variants
      });
    },
  });
};

export const useGetResumptionTime = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_RESUMPTION_DATE],
    queryFn: async () => {
      const response = await settingsService.getResumptionTime();
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
    resumptionDate: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data,
  };
};
