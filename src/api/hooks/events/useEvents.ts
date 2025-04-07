import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import eventsService from "@/src/service/api/events.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError } from "axios";

// export const useGetAllEvents = (filters?: { page: string }) => {
//   const { isError, isSuccess, data, isPending } = useQuery({
//     queryKey: [QUERY_KEYS.GET_ALL_EVENTS, filters],
//     queryFn: async () => {
//       const response = await eventsService.getAllEvents(filters);

//       return response;
//     },
//     placeholderData: keepPreviousData,
//   });

//   const events = data?.data?.data || [];
//   const pagination = data?.data?.pagination || {};
//   return {
//     isError,
//     isSuccess,
//     isPending,
//     events,
//     pagination,
//   };
// };

export const useGetAllEvents = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_EVENTS, filters],
    queryFn: async () => {
      const response = await eventsService.getAllEvents(filters);
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
      if (error instanceof Error && error.response?.status === 404)
        return false;
      return failureCount < 2;
    },
  });

  return {
    isError,
    isSuccess,
    isLoading: isPending && !isFetching, // Distinguish between initial load and background refresh
    isFetching,
    events: data?.data?.data || [],
    pagination: data?.data?.pagination || {},
    rawData: data, // Provide access to raw response if needed
  };
};

// export const useCreateEvent = () => {
//   const queryClient = useQueryClient();
//   const {
//     mutate: mutateCreateEvent,
//     isPending,
//     isSuccess,
//     isError,
//   } = useMutation({
//     mutationFn: async (data: {
//       event_name?: string;
//       description?: string;
//       date?: string;
//       time?: string;
//       meeting_link?: string;
//       notification_type?: string;
//       department_id?: string;
//       emails?: string[];
//     }) => {
//       const response = await eventsService.createEvent(data);
//       return response;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_ALL_EVENTS],
//       });
//     },
//     onError: (error: {
//       response: {
//         data: {
//           message: string;
//         };
//       };
//     }) => {
//       console.error("Error adding employee:", error.response.data);
//     },
//   });
//   return {
//     mutateCreateEvent,
//     isPending,
//     isSuccess,
//     isError,
//   };
// };

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: {
      event_name?: string;
      description?: string;
      date?: string;
      time?: string;
      meeting_link?: string;
      notification_type?: string;
      department_id?: string;
      emails?: string[];
    }) => {
      const response = await eventsService.createEvent(eventData);
      return response;
    },
    onMutate: async (newEvent) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ALL_EVENTS],
      });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData([
        QUERY_KEYS.GET_ALL_EVENTS,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_EVENTS],
        (old: {
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any[];
          };
        }) => {
          const newData = { ...old };
          if (newData?.data?.data) {
            newData.data.data = [newEvent, ...newData.data.data];
          }
          return newData;
        }
      );

      // Return a context object with the snapshotted value
      return { previousEvents };
    },
    onError: (err, newEvent, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(
        [QUERY_KEYS.GET_ALL_EVENTS],
        context?.previousEvents
      );

      // More robust error handling
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Failed to create event";
        throw new Error(errorMessage);
      } else {
        throw err;
      }
    },
    onSettled: () => {
      // Invalidate and refetch after either success or error
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_EVENTS],
        exact: false, // Invalidate all variants
      });
    },
  });
};
