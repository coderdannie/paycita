type Feature = {
  employee_loan: string | null
  utility_request: string | null
} | null

interface LoggedInUserProps {
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
