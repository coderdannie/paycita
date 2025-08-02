import { CommentData, EmployeeQuery } from '@/src/types/queryMgt';
import { api } from '.';

const addQuery = (data: EmployeeQuery) => {
  return api.post('/hr/query-mgt', data);
};

const getAllQuery = (filters?: {
  page: string;
  query_title?: string;
  priority?: string;
  department?: string;
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
    filters.query_title !== null &&
    filters.query_title !== undefined &&
    filters.query_title !== ''
  ) {
    queryParams.append('query_title', filters.query_title.toString());
  }

  if (
    filters.priority !== null &&
    filters.priority !== undefined &&
    filters.priority !== ''
  ) {
    queryParams.append('priority', filters.priority.toString());
  }

  if (
    filters.department !== null &&
    filters.department !== undefined &&
    filters.department !== ''
  ) {
    queryParams.append('department', filters.department.toString());
  }

  return api.get(`/hr/query-mgt?${queryParams.toString()}`);
};

const getAllUsers = () => {
  return api.get(`/hr/all-employee`);
};

const deleteQuery = (id: string) => {
  return api.delete(`/hr/query-mgt/${id}`);
};

const getQueryDetails = (id: string) => {
  return api.get(`/hr/query-mgt/${id}`);
};

const addComment = (data: CommentData) => {
  return api.post('/hr/add-query-comment', data);
};

const updateQueryStatus = (id: string, data: { status: string }) => {
  return api.post(`/hr/update-query-status/${id}`, data);
};

const queryMgtService = {
  addQuery,
  getAllQuery,
  getAllUsers,
  deleteQuery,
  getQueryDetails,
  addComment,
  updateQueryStatus,
};

export default queryMgtService;
