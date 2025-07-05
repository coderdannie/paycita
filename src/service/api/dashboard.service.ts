import {
  CompensationDetails,
  FirstGuarantor,
  JobDetails,
  SecondGuarantor,
  UserBasicDetails,
} from '@/src/types/dashboard';
import { api, api2 } from '.';
import { AddEmployee } from '../../utils/validations';
import { EmergencyContact } from '@/src/Redux/features/userDetailsSlice';

const getAttendance = (filters: {
  page: string;
  employee_name?: string;
  status?: string;
  job_title?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }
  if (
    filters.employee_name !== null &&
    filters.employee_name !== undefined &&
    filters.employee_name !== ''
  ) {
    queryParams.append('employee_name', filters.employee_name.toString());
  }
  if (
    filters.status !== null &&
    filters.status !== undefined &&
    filters.status !== ''
  ) {
    queryParams.append('status', filters.status.toString());
  }
  if (
    filters.job_title !== null &&
    filters.job_title !== undefined &&
    filters.job_title !== ''
  ) {
    queryParams.append('job_title', filters.job_title.toString());
  }
  return api.get(`/hr/employee-attendance?${queryParams.toString()}`);
};

const addEmployee = (data: AddEmployee) => {
  return api.post('/hr/employee', data);
};

const getDepartments = () => {
  return api.get('/hr/department');
};

const getAllBranches = () => {
  return api.get('/hr/branch');
};

const getPensionCompanies = () => {
  return api.get('/hr/get-pensions');
};
const getGivenItems = () => {
  return api.get('/hr/item');
};

const getAllEmployees = (filters: {
  page: string;
  employee_name?: string;
  status?: string;
  job_title?: string;
  job_level?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }
  if (
    filters.employee_name !== null &&
    filters.employee_name !== undefined &&
    filters.employee_name !== ''
  ) {
    queryParams.append('employee_name', filters.employee_name.toString());
  }
  if (
    filters.status !== null &&
    filters.status !== undefined &&
    filters.status !== ''
  ) {
    queryParams.append('status', filters.status.toString());
  }
  if (
    filters.job_title !== null &&
    filters.job_title !== undefined &&
    filters.job_title !== ''
  ) {
    queryParams.append('job_title', filters.job_title.toString());
  }
  if (
    filters.job_level !== null &&
    filters.job_level !== undefined &&
    filters.job_level !== ''
  ) {
    queryParams.append('job_level', filters.job_level.toString());
  }
  return api.get(`/hr/employee?${queryParams.toString()}`);
};

const getEmployeeById = (id: string) => {
  return api.get(`/hr/employee/${id}`);
};

const offBoardEmployee = (data: { items: string[]; employee_id: string }) => {
  return api.delete('/hr/employee-offboarding', {
    data,
  });
};

const resetEmployeePassword = async (query: { userId: string }) => {
  const RESET_EMPLOYEE_PASSWORD = (userId = '') =>
    `/hr/change-password/${userId}`;
  const res = await api.post(RESET_EMPLOYEE_PASSWORD(query.userId));
  return res.data;
};

const updateBasicEmployeeDetails = async (
  query: { userId: string },
  data: UserBasicDetails
) => {
  const UPDATE_BASIC_EMPLOYEE_DETAILS = (userId = '') =>
    `/hr/change-employee-info/${userId}`;
  const res = await api.post(UPDATE_BASIC_EMPLOYEE_DETAILS(query.userId), data);
  return res.data;
};

const updateEmployeeAddress = async (
  query: { userId: string },
  data: { address: string }
) => {
  const UPDATE_EMPLOYEE_ADDRESS = (userId = '') =>
    `/hr/change-employee-address/${userId}`;
  const res = await api.post(UPDATE_EMPLOYEE_ADDRESS(query.userId), data);
  return res.data;
};

const updateEmployeeFirstGuarantor = async (
  query: { userId: string },
  data: FirstGuarantor
) => {
  const UPDATE_EMPLOYEE_FIRST_GUARANTOR = (userId = '') =>
    `/hr/change-employee-first-guarantor/${userId}`;
  const res = await api.post(
    UPDATE_EMPLOYEE_FIRST_GUARANTOR(query.userId),
    data
  );
  return res.data;
};

const updateEmployeeSecondGuarantor = async (
  query: { userId: string },
  data: SecondGuarantor
) => {
  const UPDATE_EMPLOYEE_SECOND_GUARANTOR = (userId = '') =>
    `/hr/change-employee-second-guarantor/${userId}`;
  const res = await api.post(
    UPDATE_EMPLOYEE_SECOND_GUARANTOR(query.userId),
    data
  );
  return res.data;
};

const updateEmployeeEmergencyContact = async (
  query: { userId: string },
  data: EmergencyContact
) => {
  const UPDATE_EMERGENCY_CONTACT = (userId = '') =>
    `/hr/change-employee-emergency/${userId}`;
  const res = await api.post(UPDATE_EMERGENCY_CONTACT(query.userId), data);
  return res.data;
};

const updateEmployeeWorkDetails = async (
  query: { userId: string },
  data: JobDetails
) => {
  const UPDATE_EMPLOYEE_WORK_DETAILS = (userId = '') =>
    `/hr/change-employee-work-details/${userId}`;
  const res = await api.post(UPDATE_EMPLOYEE_WORK_DETAILS(query.userId), data);
  return res.data;
};

const updateEmployeeSalaryDetails = async (
  query: { userId: string },
  data: CompensationDetails
) => {
  const UPDATE_EMPLOYEE_SALARY_DETAILS = (userId = '') =>
    `/hr/change-employee-salary-details/${userId}`;
  const res = await api.post(
    UPDATE_EMPLOYEE_SALARY_DETAILS(query.userId),
    data
  );
  return res.data;
};

// /hr/bulk-employee-onboarding

const bulkEmployeeOnboarding = (data: FormData) => {
  return api2.post(`/hr/bulk-employee-onboarding`, data, {
    headers: {
      // Let browser set Content-Type with boundary for FormData
      'Content-Type': undefined,
    },
  });
};

const dashboardService = {
  getAttendance,
  addEmployee,
  getDepartments,
  getPensionCompanies,
  getGivenItems,
  getAllEmployees,
  getEmployeeById,
  offBoardEmployee,
  resetEmployeePassword,
  updateBasicEmployeeDetails,
  updateEmployeeAddress,
  updateEmployeeFirstGuarantor,
  updateEmployeeSecondGuarantor,
  updateEmployeeEmergencyContact,
  updateEmployeeWorkDetails,
  updateEmployeeSalaryDetails,
  getAllBranches,
  bulkEmployeeOnboarding,
};

export default dashboardService;
