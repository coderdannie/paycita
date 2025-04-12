import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import dashboardService from "@/src/service/api/dashboard.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { useDispatch } from "react-redux";
import {
  setEmployeeAttendance,
  setEmployeeAttendancePagination,
} from "@/src/Redux/features/dashboardSlice";
import { useEffect } from "react";
import { AddEmployee } from "@/src/utils/validations";

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

export const useAddEmployee = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateAddEmployee,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: AddEmployee) => {
      const response = await dashboardService.addEmployee(data);
      return response;
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
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
    mutateAddEmployee,
    isPending,
    isSuccess,
    isError,
  };
};

export const useGetDepartments = () => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_DEPARTMENTS],
    queryFn: async () => {
      const response = await dashboardService.getDepartments();
      return response;
    },
  });

  const departments = data?.data?.data || [];
  const departmentOptions = departments.map(
    (department: { id: string; name: string }) => ({
      label: department.name,
      value: department.id,
    })
  );

  return {
    departmentOptions,
    isSuccess,
    isError,
    isPending,
  };
};

export const useGetPensionCompanies = () => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_PENSION_COMPANIES],
    queryFn: async () => {
      const response = await dashboardService.getPensionCompanies();
      return response;
    },
  });

  const pensionCompanies = data?.data?.data || [];
  const pensionCompanyOptions = pensionCompanies.map(
    (pensionCompany: { id: string; name: string }) => ({
      label: pensionCompany.name,
      value: pensionCompany.id,
    })
  );

  return {
    pensionCompanyOptions,
    isSuccess,
    isError,
    isPending,
  };
};

export const useGetGivenItems = () => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_GIVEN_ITEMS],
    queryFn: async () => {
      const response = await dashboardService.getGivenItems();
      return response;
    },
  });

  const givenItems = data?.data?.data || [];
  const givenItemsOptions = givenItems.map(
    (item: { id: string; name: string }) => ({
      label: item.name,
      value: item.id,
    })
  );

  return {
    givenItemsOptions,
    isSuccess,
    isError,
    isPending,
  };
};

export const useGetAllEmployees = (filters: {
  page: string;
  employee_name?: string;
  status?: string;
  job_title?: string;
  job_level?: string;
}) => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES, filters],
    queryFn: async () => {
      const response = await dashboardService.getAllEmployees(filters);
      return response;
    },
  });

  const employees = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  return {
    employees,
    isSuccess,
    isError,
    isPending,
    pagination,
  };
};

export const useGetEmployeeById = (id: string) => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID, id],
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await dashboardService.getEmployeeById(id);
      return response;
    },
  });

  const employee = data?.data?.data || {};

  return {
    employee,
    isSuccess,
    isError,
    isPending,
  };
};

export const useOffBoardEmployee = () => {
  const queryClient = useQueryClient();

  const {
    mutate: offBoardEmployee,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: { items: string[]; employee_id: string }) => {
      const response = await dashboardService.offBoardEmployee(data);
      return response;
    },
    onSuccess: () => {
      // Refetch the employee list or any relevant queries after successful offboarding
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
      });
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
      console.error("Error offboarding employee:", error.response.data.message);
    },
  });

  return {
    offBoardEmployee, // Mutation function to trigger the offboarding
    isPending, // Loading state
    isSuccess, // Success state
    isError, // Error state
  };
};

