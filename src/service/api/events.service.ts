import { api } from "../../api";

const getAllEvents = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }

  return api.get(`/hr/event?${queryParams.toString()}`);
};

const createEvent = (data: {
  event_name?: string;
  description?: string;
  date?: string;
  time?: string;
  meeting_link?: string;
  notification_type?: string;
  department_id?: string;
  emails?: string[];
}) => {
  return api.post("/hr/event", data);
};
const updateEvent = (data: {
  id?: string;
  event_name?: string;
  description?: string;
  date?: string;
  time?: string;
  meeting_link?: string;
}) => {
  return api.put(`/hr/event/${data.id}`, data);
};

export const deleteEvent = (eventId: string) => {
  return api.delete(`/hr/event/${eventId}`);
};

const eventsService = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};

export default eventsService;
