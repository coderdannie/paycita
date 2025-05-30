import { api } from '.';

const getWalletHistory = () => {
  return api.get(`/hr/department-wallet`);
};

const requestFunds = (data: { amount: string; reason: string }) => {
  return api.post(`/hr/request-department-funding`, data);
};

const getDepartmentWalletRequest = () => {
  return api.get(`/hr/department-wallet-request`);
};

const walletService = {
  getWalletHistory,
  requestFunds,
  getDepartmentWalletRequest,
};

export default walletService;
