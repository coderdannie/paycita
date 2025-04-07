import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import eventsService from "@/src/service/api/events.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";

export const useGetAllEvents = (filters?: { page: string }) => {
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_EVENTS, filters],
    queryFn: async () => {
      const response = await eventsService.getAllEvents(filters);

      return response;
    },
    placeholderData: keepPreviousData,
  });

  const events = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};
  return {
    isError,
    isSuccess,
    isPending,
    events,
    pagination,
  };
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateCreateEvent,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: {
      event_name?: string;
      description?: string;
      date?: string;
      time?: string;
      meeting_link?: string;
      notification_type?: string;
      department_id?: string;
      emails?: string[];
    }) => {
      const response = await eventsService.createEvent(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_EVENTS],
      });
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      console.error("Error adding employee:", error.response.data);
    },
  });
  return {
    mutateCreateEvent,
    isPending,
    isSuccess,
    isError,
  };
};
 
