import { api, api2 } from ".";

const getMyPayslip = () => {
  return api.get(`/hr/payslip`);
};
const getMyPension = () => {
  return api.get(`/hr/pension`);
};
const getMyTax = () => {
  return api.get(`/hr/tax`);
};
const getSinglePayslip = (id: string) => {
  return api.get(`/hr/get-single-payroll/${id}`);
};

const getPayRoll = () => {
  return api.get(`/hr/payroll`);
};

const getPayRollByMonth = (data: { date: string }) => {
  return api.post(`/hr/get-payroll-by-month`, data);
};

const getSinglePayRoll = (id: string) => {
  return api.get(`/hr/payroll/${id}`);
};

const uploadPayroll = (data: FormData) => {
  return api2.post(`/hr/payroll`, data);
};

const getPayRollTax = () => {
  return api.get(`/hr/employee-tax`);
};

const payslipService = {
  getMyPayslip,
  getMyPension,
  getMyTax,
  getSinglePayslip,
  getPayRoll,
  getPayRollByMonth,
  getSinglePayRoll,
  uploadPayroll,
  getPayRollTax,
};

export default payslipService;
