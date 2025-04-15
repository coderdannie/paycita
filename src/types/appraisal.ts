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
