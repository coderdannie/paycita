import { Loan } from "@/src/types/loan";
import { api } from ".";

const getAllLoan = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }

  return api.get(`/hr/loan?${queryParams.toString()}`);
};

const createLoan = (data: Loan) => {
  return api.post("/hr/loan", data);
};
const getSingleLoan = (id: string) => {
  return api.get(`/hr/loan/${id}`);
};

export const deleteLoan = (LoanId: string) => {
  return api.delete(`/hr/loan/${LoanId}`);
};

export const getRepaymentPeriod = () => {
  return api.get("/hr/get-loan-period");
};
export const getLoanType = () => {
  return api.get("/hr/get-loan-type");
};
export const getLoanTypeDetails = (id: string) => {
  return api.get(`/hr/get-loan-type-details/${id}`);
};

const loanService = {
  getAllLoan,
  createLoan,
  getSingleLoan,
  deleteLoan,
  getRepaymentPeriod,
  getLoanType,
  getLoanTypeDetails,
};

export default loanService;
