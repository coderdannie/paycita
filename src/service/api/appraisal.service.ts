import { api } from ".";
import { AppraisalFormValues, AppraisalResponse } from "@/src/types/appraisal";

export interface AssessmentData {
  appraisal_id: string;
  job_knowledge: string;
  communication: string;
  team_work: string;
  problem_solving: string;
  punctuality: string;
  quality_of_work: string;
  innovation: string;
  productivity: string;
  customer_service: string;
  accountability: string;
  company_policy: string;
  professionalism: string;
  leadership: string;
  comment: string;
}

const getAppraisals = (filters: {
  page: string;
  status?: string;
  title?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ""
  ) {
    queryParams.append("page", filters.page);
  }

  if (
    filters.status !== null &&
    filters.status !== undefined &&
    filters.status !== ""
  ) {
    queryParams.append("status", filters.status.toString());
  }
  if (
    filters.title !== null &&
    filters.title !== undefined &&
    filters.title !== ""
  ) {
    queryParams.append("title", filters.title.toString());
  }
  return api.get(`/hr/appraisals?${queryParams.toString()}`);
};

const takeAssessment = (data: AssessmentData) => {
  return api.post("/hr/appraisals", data);
};

const getAppraisalsById = (id: string) => {
  return api.get(`/hr/appraisals/${id}`);
};

const createAppraisals = (data: AppraisalFormValues) => {
  return api.post<AppraisalResponse>("/hr/create-new-appraisal", data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

const getAllAppraisalsByDepartment = (id: string) => {
  return api.get(`/hr/all-department-appraisal/${id}`);
};
const getAppraisalsByDepartment = (id: string) => {
  return api.get(`/hr/department-appraisals/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

const appraisalService = {
  getAppraisals,
  takeAssessment,
  getAppraisalsById,
  createAppraisals,
  getAllAppraisalsByDepartment,
  getAppraisalsByDepartment,
};

export default appraisalService;
