import { api } from "@/src/api";

const logoutUser = () => {
  return api.post("/hr/logout");
};

export { logoutUser };