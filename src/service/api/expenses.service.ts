import { Expenses } from '@/src/types/procurement';
import { api } from '.';

const getAllExpenses = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }

  return api.get(`/hr/expenses-request?${queryParams.toString()}`);
};

const createExpenses = (data: Expenses) => {
  return api.post('/hr/expenses-request', data);
};
const getSingleExpenses = (id: string) => {
  return api.get(`/hr/expenses-request/${id}`);
};

export const deleteExpenses = (ExpensesId: string) => {
  return api.delete(`/hr/delete-expenses-request/${ExpensesId}`);
};

export const getExpenseType = () => {
  return api.get('/hr/expenses-type');
};

const resolveExpensesCommentThread = (id: string) => {
  return api.post(`/hr/resolve-expense-comment/${id}`);
};

const updateExpenses = (id: string, data: Expenses) => {
  return api.put(`/hr/update-expenses-request/${id}`, data);
};

const getAllProcurements = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters?.page !== null &&
    filters?.page !== undefined &&
    filters?.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }

  return api.get(`/hr/all-procurements?${queryParams.toString()}`);
};

const getAllPurchaseExpenses = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters?.page !== null &&
    filters?.page !== undefined &&
    filters?.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }

  return api.get(`/hr/all-expenses?${queryParams.toString()}`);
};

const getAllReimbursements = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters?.page !== null &&
    filters?.page !== undefined &&
    filters?.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }

  return api.get(`/admin/all-reimbursements?${queryParams.toString()}`);
};
const expenseService = {
  getAllExpenses,
  createExpenses,
  getSingleExpenses,
  deleteExpenses,
  getExpenseType,
  resolveExpensesCommentThread,
  updateExpenses,
  getAllProcurements,
  getAllPurchaseExpenses,
  getAllReimbursements,
};

export default expenseService;
