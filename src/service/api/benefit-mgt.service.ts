import { BenefitFormData } from '@/src/types/dashboard';
import { api } from '.';

const getBenefits = (filters: {
  page: string;
  employee_name?: string;
  status?: string;
  job_title?: string;
  job_level?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }
  if (
    filters.employee_name !== null &&
    filters.employee_name !== undefined &&
    filters.employee_name !== ''
  ) {
    queryParams.append('employee_name', filters.employee_name.toString());
  }
  if (
    filters.status !== null &&
    filters.status !== undefined &&
    filters.status !== ''
  ) {
    queryParams.append('status', filters.status.toString());
  }
  if (
    filters.job_title !== null &&
    filters.job_title !== undefined &&
    filters.job_title !== ''
  ) {
    queryParams.append('job_title', filters.job_title.toString());
  }
  if (
    filters.job_level !== null &&
    filters.job_level !== undefined &&
    filters.job_level !== ''
  ) {
    queryParams.append('job_level', filters.job_level.toString());
  }
  return api.get(`/hr/benefit?${queryParams.toString()}`);
};

const addBenefit = (data: BenefitFormData) => {
  return api.post('/hr/benefit', data);
};

const updateBenefit = (data: {
  id: string;
  benefit_name?: string;
  description?: string;
  benefit_type?: string;
  unit?: string;
  allocation?: string;
  recurring?: string;
}) => {
  return api.put(`/hr/benefit/${data.id}`, data);
};

const deleteBenefit = (id: string) => {
  return api.delete(`/hr/benefit/${id}`);
};

const benefitMgtService = {
  getBenefits,
  addBenefit,
  updateBenefit,
  deleteBenefit,
};

export default benefitMgtService;
