import { api, api2 } from "../../api";

const getAllProfileSettings = () => {
  return api.get(`/hr/profile`);
};

const updateProfilePicture = (data: FormData) => {
  return api2.post("/hr/profile-picture", data);
};
const changePassword = (data: {
  old_password: string;
  new_password: string;
}) => {
  return api.post("/hr/change-password", data);
};
const addResumptionDate = (data: {
  resumption_time: string;
  closing_time: string;
}) => {
  return api.post("/hr/resumption_time", data);
};
const getResumptionTime = () => {
  return api.get(`/hr/resumption_time`);
};

const uploadDocuments = (data: FormData) => {
  return api2.post("/hr/upload-document", data);
};

const settingsService = {
  getAllProfileSettings,
  updateProfilePicture,
  changePassword,
  addResumptionDate,
  getResumptionTime,
  uploadDocuments,
};

export default settingsService;
