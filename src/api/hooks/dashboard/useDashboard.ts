import {
  // useMutation,
  useQuery,
  keepPreviousData,
  // useQueryClient,
} from "@tanstack/react-query";

import dashboardService from "@/src/service/dashboard.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { useDispatch } from "react-redux";
import {
  setEmployeeAttendance,
  setEmployeeAttendancePagination,
} from "@/src/Redux/features/dashboardSlice";
import { useEffect } from "react";

export const useGetAttendance = (filters: {
  page: string;
  employee_name?: string;
  status?: string;
  job_title?: string;
}) => {
  const dispatch = useDispatch();
  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_EMPLOYEE_ATTENDANCE, filters],
    queryFn: async () => {
      const response = await dashboardService.getAttendance(filters);

      return response;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setEmployeeAttendance(data?.data?.data));
      dispatch(setEmployeeAttendancePagination(data?.data?.pagination));
    }
  }, [data?.data?.data, data?.data?.pagination, dispatch, isSuccess]);

  return {
    isError,
    isSuccess,
    isPending,
  };
};
