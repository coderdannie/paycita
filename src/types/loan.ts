export interface Loan {
  id: number;
  loan_number: string;
  loan_amount: string;
  loan_period: string;
  outstanding: number;
  total_payment: string;
  payment_status: string;
  staff_name: string;
  finance_status: string;
  management_status: string;
  created_at: string;
  status: string;
}

export interface CreateLoanProps {
  amount: string;
  loan_type: string;
  loan_purpose: string;
  salary_deduction_agreement: boolean;
}

export interface LoanType {
  id: number;
  tenant_id: number;
  loan_type: string;
  policy_name: string;
  eligibility: string;
  maximum_loan_limit: string;
  repayment_method: string;
  created_at: string;
  updated_at: string;
}

export interface LoanRequest {
  id: number;
  loan_number: string;
  employee_name: string;
  department: string;
  amount: string;
  months: string;
  status: string;
}

export interface LoanRepaymentHistory {
  loan_details: {
    loan_number: string;
    amount: string;
    repayment_period: string;
    created_at: string;
  };
  // repayment_history: any[];
}

export interface LoanPolicy {
  id: number;
  tenant_id: number;
  loan_type: string;
  policy_name: string;
  eligibility: string;
  maximum_loan_limit: string;
  repayment_method: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLoanPolicyProps {
  loan_type: string;
  policy_name: string;
  eligibility: string;
  loan_limit: string;
  repayment_period: string;
}

export interface PendingLoan {
  approval_status_id: number;
  loan_number: string;
  employee_name: string;
  amount: string;
  payment_period: string;
  purpose_of_loan: string;
  date: string;
  status: string;
}

export interface LoanPolicyData {
  loan_type?: string;
  policy_name: string;
  eligibility: string;
  loan_limit: string;
  repayment_period: string;
}
