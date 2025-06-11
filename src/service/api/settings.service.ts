import { api, api2 } from '.';

const getAllProfileSettings = () => {
  return api.get(`/hr/profile`);
};

const updateProfilePicture = (data: FormData) => {
  return api2.post('/hr/profile-picture', data);
};
const changePassword = (data: {
  old_password: string;
  new_password: string;
}) => {
  return api.post('/hr/change-password', data);
};
const addResumptionDate = (data: {
  resumption_time: string;
  closing_time: string;
}) => {
  return api.post('/hr/resumption_time', data);
};
const getResumptionTime = () => {
  return api.get(`/hr/resumption_time`);
};

const uploadDocuments = (data: FormData) => {
  return api2.post('/hr/upload-document', data);
};

const addBankDetails = (data: {
  bank_name: string;
  bank_account_number: string;
  account_name: string;
  bank_code?: string; //nullable
}) => {
  return api.post('/hr/bank-account', data);
};

const getBanks = () => {
  return api.get(`/hr/all-banks`);
};

const updateBankDetails = (data: {
  id: string;
  bank_name: string;
  bank_account_number: string;
  account_name: string;
  bank_code?: string; //nullable
}) => {
  const payload = {
    bank_name: data.bank_name,
    bank_account_number: data.bank_account_number,
    account_name: data.account_name,
    bank_code: data.bank_code,
  };

  return api.put(`/hr/bank-account/${data.id}`, payload);
};

const settingsService = {
  getAllProfileSettings,
  updateProfilePicture,
  changePassword,
  addResumptionDate,
  getResumptionTime,
  uploadDocuments,
  addBankDetails,
  updateBankDetails,
  getBanks,
};

export default settingsService;
