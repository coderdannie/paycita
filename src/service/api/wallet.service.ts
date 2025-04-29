import { api } from ".";

const getWalletHistory = () => {
  return api.get(`/hr/department-wallet`);
};

const requestFunds = (data: { amount: string; reason: string }) => {
  return api.post(`/hr/request-department-funding`, data);
};

const walletService = {
  getWalletHistory,
  requestFunds,
};

export default walletService;
