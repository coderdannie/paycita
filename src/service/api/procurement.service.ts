import { Procurement } from "@/src/types/procurement";
import { api } from "../../api";

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

export const deleteProcurement = (eventId: string) => {
  return api.delete(`/hr/procurement/${eventId}`);
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
