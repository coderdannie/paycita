import { api } from ".";

const getAllNotifications = () => {
  return api.get(`/hr/all-notifications`);
};

const deleteNotification = (id: string) => {
  return api.delete(`/hr/delete-notification/${id}`);
};

const deleteAllNotifications = () => {
  return api.delete(`/hr/delete-all-notifications`);
};

const appNotificationService = {
  getAllNotifications,
  deleteAllNotifications,
  deleteNotification,
};

export default appNotificationService;
