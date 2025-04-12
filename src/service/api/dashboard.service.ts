import { api } from "../../api";
import { AddEmployee } from "../../utils/validations";

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
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }
  if (
    filters.employee_name !== null &&
    filters.employee_name !== undefined &&
    filters.employee_name !== ""
  ) {
    queryParams.append("employee_name", filters.employee_name.toString());
  }
  if (
    filters.status !== null &&
    filters.status !== undefined &&
    filters.status !== ""
  ) {
    queryParams.append("status", filters.status.toString());
  }
  if (
    filters.job_title !== null &&
    filters.job_title !== undefined &&
    filters.job_title !== ""
  ) {
    queryParams.append("job_title", filters.job_title.toString());
  }
  return api.get(`/hr/employee-attendance?${queryParams.toString()}`);
};

const addEmployee = (data: AddEmployee) => {
  return api.post("/hr/employee", data);
};

const getDepartments = () => {
  return api.get("/hr/department");
};

const getPensionCompanies = () => {
  return api.get("/hr/get-pensions");
};
const getGivenItems = () => {
  return api.get("/hr/item");
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
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }
  if (
    filters.employee_name !== null &&
    filters.employee_name !== undefined &&
    filters.employee_name !== ""
  ) {
    queryParams.append("employee_name", filters.employee_name.toString());
  }
  if (
    filters.status !== null &&
    filters.status !== undefined &&
    filters.status !== ""
  ) {
    queryParams.append("status", filters.status.toString());
  }
  if (
    filters.job_title !== null &&
    filters.job_title !== undefined &&
    filters.job_title !== ""
  ) {
    queryParams.append("job_title", filters.job_title.toString());
  }
  if (
    filters.job_level !== null &&
    filters.job_level !== undefined &&
    filters.job_level !== ""
  ) {
    queryParams.append("job_level", filters.job_level.toString());
  }
  return api.get(`/hr/employee?${queryParams.toString()}`);
};

const getEmployeeById = (id: string) => {
  return api.get(`/hr/employee/${id}`);
};

const offBoardEmployee = (data: { items: string[]; employee_id: string }) => {
  return api.delete("/hr/employee-offboarding", {
    data,
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
};

export default dashboardService;
