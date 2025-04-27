type Feature = {
  employee_loan: string | null
  utility_request: string | null
} | null

interface LoggedInUserProps {
  approvals: any[];
  line_manager: any;
  birthday: boolean;
  company_logo: string;
  currency: string;
  email: string;
  feature: Feature;
  full_name: string;
  id: string;
  phone_number: string;
  role: string;
}
