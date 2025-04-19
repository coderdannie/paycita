import { api } from ".";
import { LeaveRequestSchemaType } from "../../utils/validations";

const getAllLeave = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }

  return api.get(`/hr/leave?${queryParams.toString()}`);
};

const createLeave = (data: LeaveRequestSchemaType) => {
  return api.post("/hr/leave", data);
};

const getEmployeeLeave = (filters?: {
  page: string;
  employee_name?: string;
  status?: string;
  leave_type?: string;
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
    filters.leave_type !== null &&
    filters.leave_type !== undefined &&
    filters.leave_type !== ""
  ) {
    queryParams.append("leave_type", filters.leave_type.toString());
  }

  return api.get(`/hr/employee-leave?${queryParams.toString()}`);
};

const updateLeaveRequests = (data: {
  id: string;
  status: string;
  comment?: string;
}) => {
  const { id, status, comment } = data;
  return api.post(`/hr/update-leave-status/${id}`, { status, comment });
};

const deleteLeaveRequest = (id: string) => {
  return api.delete(`/hr/leave/${id}`);
};

const leaveService = {
  getAllLeave,
  createLeave,
  getEmployeeLeave,
  updateLeaveRequests,
  deleteLeaveRequest,
};

export default leaveService;
