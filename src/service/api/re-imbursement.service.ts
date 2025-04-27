import { api, api2 } from ".";

export interface Reimbursement {
  employee_name: string;
  id: string;
  rb_number: string;
  amount: string;
  description: string;
  date_of_purchase: string;
  status: string;
}

export interface PostReimbursement {
  amount: string;
  date_of_purchase: string;
  description: string;
  reason: string;
  proof_of_purchase: File | null;
}

const reimbursementService = {
  getAllReimbursements: (filters: { page: string; title: string }) => {
    const queryParams = new URLSearchParams();
    if (
      filters?.page !== null &&
      filters?.page !== undefined &&
      filters?.page !== ""
    ) {
      queryParams.append("page", filters.page);
    }
    if (
      filters?.title !== null &&
      filters?.title !== undefined &&
      filters.title !== ""
    ) {
      queryParams.append("title", filters.title);
    }
    return api.get(`/hr/re-imbursement?${queryParams.toString()}`);
  },

  createReimbursement: (data: FormData) =>
    api2.post(`/hr/re-imbursement`, data),

  getReimbursementById: (id: string) => api.get(`/hr/re-imbursement/${id}`),

  updateReimbursement: (id: string, data: FormData) =>
    api.patch<Reimbursement>(`/hr/reimbursement/${id}`, data),

  deleteReimbursement: (id: string) =>
    api.delete<Reimbursement>(`/hr/reimbursement/${id}`),
};

export default reimbursementService;
