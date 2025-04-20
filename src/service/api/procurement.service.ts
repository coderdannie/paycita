import { Procurement } from "@/src/types/procurement";
import { api } from ".";

const getAllProcurements = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }

  return api.get(`/hr/procurement?${queryParams.toString()}`);
};

const createProcurements = (data: Procurement) => {
  return api.post("/hr/procurement", data);
};
const getSingleProcurement = (id: string) => {
  return api.get(`/hr/procurement/${id}`);
};

export const deleteProcurement = (procurementId: string) => {
  return api.delete(`/hr/delete-procurement/${procurementId}`);
};

export const getVendors = () => {
  return api.get("/hr/vendors");
};

const procurementService = {
  getAllProcurements,
  createProcurements,
  getSingleProcurement,
  deleteProcurement,
  getVendors,
};

export default procurementService;
