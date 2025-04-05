import { api } from '../api';

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

const dashboardService = {
  getAttendance,
};

export default dashboardService;
