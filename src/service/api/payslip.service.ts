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

const getEmployeePension = () => {
  return api.get(`/hr/employee-pension`);
};
const getEmployeePensionByCompany = (company: {
  month: string;
  year: string;
}) => {
  return api.get(
    `/hr/pension-per-company?month=${company.month}&year=${company.year}`
  );
};
const getAllStaffPension = (company: string, date: string) => {
  return api.get(`/hr/all-staff-pension?company_name=${company}&date=${date}`);
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
  getEmployeePension,
  getEmployeePensionByCompany,
  getAllStaffPension,
};

export default payslipService;
