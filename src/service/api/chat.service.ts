import { api } from "../../api";

const getAllChat = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }

  return api.get(`/hr/get-all-chats?${queryParams.toString()}`);
};

const initializeChat = (data: Chat) => {
  return api.post("/hr/initiate-chat", data);
};
const composeChat = (data: ComposeChat) => {
  return api.post("/hr/compose-chat", data);
};
const getSingleChat = (id: string) => {
  return api.get(`/hr/get-chat-messages/${id}`);
};

export const deleteChat = (ChatId: string) => {
  return api.delete(`/hr/delete-chats/${ChatId}`);
};

const chatService = {
  getAllChat,
  initializeChat,
  composeChat,
  getSingleChat,
  deleteChat,
};

export default chatService;
