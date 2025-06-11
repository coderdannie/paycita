import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import settingsService from '@/src/service/api/settings.service';

import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';

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
    profile: data?.data?.data || {},
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
          err.response?.data?.message || 'Failed to update profile picture';
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
  return useMutation({
    mutationFn: async (passwordData: {
      old_password: string;
      new_password: string;
    }) => {
      const response = await settingsService.changePassword(passwordData);
      return response;
    },
    onError: (err: AxiosError) => {
      const errorMessage =
        (err.response?.data as { message?: string })?.message ||
        'Failed to change password';
      throw new Error(errorMessage);
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
          err.response?.data?.message || 'Failed to add resumption date';
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESUMPTION_DATE],
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

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentData: FormData) => {
      const response = await settingsService.uploadDocuments(documentData);
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
            documents: data.documents, // Update the documents in the profile
          },
        };
      });
    },
    onError: (err, newDocument, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_ALL_PROFILE],
          context.previousProfile
        );
      }

      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Failed to upload document';
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

export const useUpdateBankDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id: string;
      bank_name: string;
      bank_account_number: string;
      account_name: string;
      bank_code?: string;
    }) => settingsService.updateBankDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
      });
      toast.success('Bank details updated successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update bank details'
      );
    },
  });
};

export const useAddBankDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      bank_name: string;
      bank_account_number: string;
      account_name: string;
      bank_code?: string;
    }) => settingsService.addBankDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_PROFILE],
      });
      toast.success('Bank details added successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || 'Failed to add bank details'
      );
    },
  });
};

export const useGetBanks = () => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_BANKS],
    queryFn: async () => {
      const response = await settingsService.getBanks();
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
    banks: data?.data?.data || {},
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};
