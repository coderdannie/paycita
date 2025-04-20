import { api } from "@/src/service/api";

const logoutUser = () => {
  return api.post("/hr/logout");
};

export { logoutUser };