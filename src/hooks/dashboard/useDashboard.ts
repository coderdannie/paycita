import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import dashboardService from "@/src/service/api/dashboard.service";
import { safeLocalStorage } from "@/src/utils/safeLocalStorage";

import { useDispatch } from "react-redux";
import {
  setEmployeeAttendance,
  setEmployeeAttendancePagination,
} from "@/src/Redux/features/dashboardSlice";
import { useEffect, useState } from "react";
import { AddEmployee } from "@/src/utils/validations";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import {
  CompensationDetails,
  EmergencyContact,
  FirstGuarantor,
  JobDetails,
  SecondGuarantor,
  UpdateBasicEmployeePayload,
} from "@/src/types/dashboard";
import toast from "react-hot-toast";

const checkIsAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    const token = safeLocalStorage.getItem("access_token");
    return !!token;
  }
  return false;
};

export const useGetAttendance = (filters: {
  page: string;
  employee_name?: string;
  status?: string;
  job_title?: string;
}) => {
  const dispatch = useDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState(checkIsAuthenticated);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(checkIsAuthenticated());
    };
    window.addEventListener("storage", handleStorageChange);

    setIsAuthenticated(checkIsAuthenticated());
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const { isError, isSuccess, data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_EMPLOYEE_ATTENDANCE, filters, isAuthenticated],
    queryFn: async () => {
      const response = await dashboardService.getAttendance(filters);
      return response;
    },
    placeholderData: keepPreviousData,

    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setEmployeeAttendance(data?.data?.data));
      dispatch(setEmployeeAttendancePagination(data?.data?.pagination));
    }
  }, [data?.data?.data, data?.data?.pagination, dispatch, isSuccess]);

  return {
    isError,

    isEnabled: isAuthenticated,

    isSuccess,

    isPending: isPending && isAuthenticated,
    isLoading: isPending && isAuthenticated,
  };
};

// export const useGetAttendance = (filters: {
//   page: string;
//   employee_name?: string;
//   status?: string;
//   job_title?: string;
// }) => {
//   const dispatch = useDispatch();
//   const { isError, isSuccess, data, isPending } = useQuery({
//     queryKey: [QUERY_KEYS.GET_EMPLOYEE_ATTENDANCE, filters],
//     queryFn: async () => {
//       const response = await dashboardService.getAttendance(filters);

//       return response;
//     },
//     placeholderData: keepPreviousData,
//   });

//   useEffect(() => {
//     if (isSuccess) {
//       dispatch(setEmployeeAttendance(data?.data?.data));
//       dispatch(setEmployeeAttendancePagination(data?.data?.pagination));
//     }
//   }, [data?.data?.data, data?.data?.pagination, dispatch, isSuccess]);

//   return {
//     isError,
//     isSuccess,
//     isPending,
//   };
// };

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
      toast.error(error.response.data.message || "Failed to add employee");
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
      toast.error(error.response.data.message || "Failed to offboard employee");
    },
  });

  return {
    offBoardEmployee, // Mutation function to trigger the offboarding
    isPending, // Loading state
    isSuccess, // Success state
    isError, // Error state
  };
};

export const useResetEmployeePassword = (options = {}) => {
  const {
    mutate,
    isPending: isLoading,
    data,
  } = useMutation({
    mutationFn: dashboardService.resetEmployeePassword,
    ...options,
  });

  return { mutate, isLoading, data };
};

export const useUpdateBasicEmployeeDetails = (options = {}) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (payload: UpdateBasicEmployeePayload) =>
      dashboardService.updateBasicEmployeeDetails(
        { userId: payload.userId },
        payload.data
      ),
    mutationKey: [QUERY_KEYS.UPDATE_BASIC_EMPLOYEE_DETAILS],
    ...options,
  });

  return { mutate, isPending, ...rest };
};

export const useUpdateEmployeeAddress = (options = {}) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (payload: { userId: string; data: { address: string } }) =>
      dashboardService.updateEmployeeAddress(
        { userId: payload.userId },
        payload.data
      ),
    mutationKey: [QUERY_KEYS.UPDATE_EMPLOYEE_ADDRESS],
    ...options,
  });

  return { mutate, isPending, ...rest };
};

export const useUpdateEmployeeFirstGuarantor = (options = {}) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (payload: { userId: string; data: FirstGuarantor }) =>
      dashboardService.updateEmployeeFirstGuarantor(
        { userId: payload.userId },
        payload.data
      ),
    mutationKey: [QUERY_KEYS.UPDATE_EMPLOYEE_FIRST_GUARANTOR],
    ...options,
  });

  return { mutate, isPending, ...rest };
};

export const useUpdateEmployeeSecondGuarantor = (options = {}) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (payload: { userId: string; data: SecondGuarantor }) =>
      dashboardService.updateEmployeeSecondGuarantor(
        { userId: payload.userId },
        payload.data
      ),
    mutationKey: [QUERY_KEYS.UPDATE_EMPLOYEE_SECOND_GUARANTOR],
    ...options,
  });

  return { mutate, isPending, ...rest };
};

export const useUpdateEmployeeEmergencyContact = (options = {}) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (payload: { userId: string; data: EmergencyContact }) =>
      dashboardService.updateEmployeeEmergencyContact(
        { userId: payload.userId },
        payload.data
      ),
    mutationKey: [QUERY_KEYS.UPDATE_EMERGENCY_CONTACT],
    ...options,
  });

  return { mutate, isPending, ...rest };
};

export const useUpdateEmployeeWorkDetails = (options = {}) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (payload: { userId: string; data: JobDetails }) =>
      dashboardService.updateEmployeeWorkDetails(
        { userId: payload.userId },
        payload.data
      ),
    mutationKey: ["UPDATE_WORK_DETAILS"],
    ...options,
  });

  return { mutate, isPending, ...rest };
};

export const useUpdateEmployeeSalaryDetails = (options = {}) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (payload: { userId: string; data: CompensationDetails }) =>
      dashboardService.updateEmployeeSalaryDetails(
        { userId: payload.userId },
        payload.data
      ),
    mutationKey: ["UPDATE_SALARY_DETAILS"],
    ...options,
  });

  return { mutate, isPending, ...rest };
};

export const useGetAllBranches = () => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_BRANCHES],
    queryFn: async () => {
      const response = await dashboardService.getAllBranches();
      return response;
    },
  });

  const allBranches = data?.data?.data || [];
  const allBranchesOptions = allBranches.map(
    (allBranches: { id: string; name: string }) => ({
      label: allBranches.name,
      value: allBranches.id,
    })
  );

  return {
    allBranchesOptions,
    isSuccess,
    isError,
    isPending,
  };
};

export const useBulkEmployeeOnboarding = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { files: UploadedFile[] }) =>
      dashboardService.bulkEmployeeOnboarding(payload.files),
    mutationKey: [QUERY_KEYS.BULK_EMPLOYEE_ONBOARDING],
  });

  return { mutate, isPending };
};
