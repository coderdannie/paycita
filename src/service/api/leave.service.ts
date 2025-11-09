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
  const formData = new FormData();

  formData.append("leave_type", data.leave_type);
  formData.append("start_date", data.start_date);
  formData.append("end_date", data.end_date);

  if (data.message) {
    formData.append("message", data.message);
  }

  if (data.leave_document) {
    formData.append("leave_document", data.leave_document);
  }

  return api.post("/hr/leave", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

const getLeaveTypes = (filters: { page: string; leave_type?: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("leave_type", filters.page);
  }

  return api.get(`/hr/tenant-leave-types
?${queryParams.toString()}`);
};

const addLeaveType = (data: { leave_name: string }) => {
  return api.post("/hr/tenant-leave-types", data);
};

const deleteLeaveType = (data: { id: string; leave_name: string }) => {
  return api.delete(`/hr/tenant-leave-types/${data.id}`);
};

const updateLeaveType = (data: { id: string; leave_name: string }) => {
  return api.put(`/hr/tenant-leave-types/${data.id}`, data);
};

const leaveService = {
  getAllLeave,
  createLeave,
  getEmployeeLeave,
  updateLeaveRequests,
  deleteLeaveRequest,
  addLeaveType,
  deleteLeaveType,
  updateLeaveType,
  getLeaveTypes,
};

export default leaveService;
