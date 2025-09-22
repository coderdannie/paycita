import { api } from ".";

const getTransactionHistory = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }
  return api.get(`/hr/bill-transactions?${queryParams.toString()}`);
};

const buyAirtime = (data: {
  amount: string;
  phone_number: string;
  network: string;
}) => {
  return api.post(`/hr/airtime`, data);
};

const buyData = (data: {
  network_id: string;
  recipient: string;
  plan_id: string;
}) => {
  return api.post(`/hr/buy-data`, data);
};

const getNetworkDataPlans = (network: string) => {
  return api.get(`/hr/data-plans?network=${network}`);
};

const buyElectricity = (data: {
  provider: string;
  meter_number: string;
  amount: string;
}) => {
  return api.post(`/hr/electricity`, data);
};

const billPaymentService = {
  getTransactionHistory,
  buyAirtime,
  buyData,
  buyElectricity,
  getNetworkDataPlans,
};

export default billPaymentService;
