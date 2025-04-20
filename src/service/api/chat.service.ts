import { api } from ".";

const getAllChat = () => {
  // const queryParams = new URLSearchParams();

  // if (
  //   filters.page !== null &&
  //   filters.page !== undefined &&
  //   filters.page !== ""
  // ) {
  //   queryParams.append("page", filters.page);
  // }

  return api.get(`/hr/get-all-chats`);
};

const getAllColleagues = () => {
  return api.get("/hr/get-all-colleagues");
};

const initializeChat = (data: { user_2_id: string }) => {
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
  getAllColleagues,
  initializeChat,
  composeChat,
  getSingleChat,
  deleteChat,
};

export default chatService;
