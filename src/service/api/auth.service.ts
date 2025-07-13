import { authApi } from ".";

const forgotPassword = (email: string) => {
  return authApi.post("/forgot-password", { email });
};

const resetPassword = (data: {
  otp: string;
  password: string;
  confirm_password: string;
}) => {
  return authApi.post("/reset-password", data);
};

const signInUser = (data: { email: string; password: string }) => {
  return authApi.post("/login", data);
};

const logoutUser = () => {
  return authApi.post("/hr/logout");
};

export { forgotPassword, resetPassword, signInUser, logoutUser };
