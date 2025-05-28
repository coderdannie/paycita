export interface ReimbursementItem {
  reimbursement_number: string;
  employee_name: string;
  id: string;
  rn: string;
  employeeName: string;
  department: string;
  description: string;
  amount: string;
  date: string;
  status: "approved" | "rejected" | "pending";
  title?: string;
  receiptUrl?: string;
}

export interface FilterState {
  status: string;
  month: string;
  year: string;
  department: string;
}
