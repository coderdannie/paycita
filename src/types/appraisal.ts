export interface Appraisal {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Completed";
}

export interface CriteriaRating {
  id: string;
  name: string;
  description: string;
  score: number;
}

export interface AssessmentSubmission {
  appraisalId: string;
  ratings: CriteriaRating[];
  feedback: string;
}

export type AppraisalFormValues = {
  title?: string;
  start_date?: string;
  end_date?: string;
  notification_type?: "all" | "department";
  department_id?: string | number;
};

export type AppraisalResponse = {
  message: string;
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  notification_type: "all" | "department";
  department_id?: string;
  created_at: string;
  updated_at: string;
};
