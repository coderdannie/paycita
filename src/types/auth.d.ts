type Feature = {
  employee_loan: string | null;
  utility_request: string | null;
} | null;

interface LoggedInUserProps {
  approvals: string[];
  line_manager: boolean;
  birthday: boolean;
  company_logo: string;
  currency: string;
  email: string;
  feature: Feature;
  full_name: string;
  id: string;
  phone_number: string;
  role: string;
  subscription_plan: string;
  // Raw features array coming from backend used to drive dynamic sidebar
  subscription_features?: Array<{
    name: string;
    approvals: string[] | null;
  }>;
}
