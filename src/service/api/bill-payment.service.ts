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

// const buyElectricity = (data: {
//   provider: string;
//   meter_number: string;
//   amount: string;
// }) => {
//   return api.post(`/hr/electricity`, data);
// };

const getElectricityProviders = () => {
  return api.get(`/hr/electricity-service`);
};

const validateElectricityNumber = (data: {
  meter_number: string;
  meter_type: "prepaid" | "postpaid" | string;
  amount: string;
  service_provider_code: string;
}) => {
  return api.post(`/hr/validate-electricity-number`, data);
};

const buyElectricity = (data: {
  meter_number: string;
  meter_type: "prepaid" | "postpaid" | string;
  amount: string;
  service_provider_code: string;
  customer_name: string; 
}) => {
  return api.post(`/hr/buy-electricity`, data);
};

const billPaymentService = {
  getTransactionHistory,
  buyAirtime,
  buyData,
  getNetworkDataPlans,
  buyElectricity,
  getElectricityProviders,
  validateElectricityNumber,
};

export default billPaymentService;
