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
  id: string,
  data: {
    status: string;
    reason?: string;
  }
) => {
  return api.post(`/hr/${route}/${id}`, data);
};

const resolveCommentThread = (route: string, id: string) => {
  return api.delete(`/hr/resolve-expense-comment/${id}`);
};

const approvalService = {
  getAllApprovals,
  addApprovalComment,
  updateApproval,
  resolveCommentThread,
};

export default approvalService;
