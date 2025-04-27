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

const uploadPayroll = (data: FormData) => {
  return api2.post(`/hr/upload-payroll`, data);
};

const payslipService = {
  getMyPayslip,
  getMyPension,
  getMyTax,
  getSinglePayslip,
  getPayRoll,
  uploadPayroll,
};

export default payslipService;
