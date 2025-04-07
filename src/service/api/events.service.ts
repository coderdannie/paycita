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

const eventsService = {
  getAllEvents,
  createEvent,
};

export default eventsService;
