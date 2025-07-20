import { api } from ".";

const getAllApprovals = (route: string) => {
  return api.get(`/hr/${route}`);
};

const addApprovalComment = (
  route: string,
  data: {
    thread_id: string;
    comment: string;
  }
) => {
  return api.post(`/hr/${route}`, data);
};

const updateApproval = (
  route: string,
  data: {
    status: string;
    reason?: string;
  },
  id?: string
) => {
  const url = id ? `/hr/${route}/${id}` : `/hr/${route}`;
  return api.post(url, data);
};

const resolveCommentThread = (route: string, id: string) => {
  return api.delete(`/hr/resolve-expense-comment/${id}`);
};

const resendApprovalOtp = async (query: { id: string }) => {
  const GET_RESEND_OTP = (id = "") => `/hr/resend-otp/${id}`;
  const res = await api.get(GET_RESEND_OTP(query.id));
  return res.data;
};

const verifyApprovalOtp = async (body: { otp: string }) => {
  const res = await api.post("/hr/verify-payment-otp", body);
  return res.data;
};

const approvalService = {
  getAllApprovals,
  addApprovalComment,
  updateApproval,
  resolveCommentThread,
  verifyApprovalOtp,
  resendApprovalOtp,
};

export default approvalService;
