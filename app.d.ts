interface UserProps {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  profile_url?: string | null;
  role?: string;
  state?: string | null;
  user_id?: string;
}

interface LoginDataProps {
  email: string;
  password: string;
}

interface RegisterProps {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  number_of_employees: string;
  country: string;
  company_name: string;
  business_type: string;
  registration_number: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  company_logo: string;
  currency: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
  profile_picture: string;
}

interface ChatUser {
  sender_id: string;
  chat_id: string;
  user_id: string;
  full_name: string;
  profile_picture: string;
  isOnline?: boolean;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

interface ChatMessage {
  updated_at: string;
  sender_id: string;
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  type: "sent" | "received";
  status: "sent" | "delivered" | "read";
}

interface UserProfileProps {
  user: User;
  token: string;
}

interface AttendanceRecord {
  clock_in: string;
  clock_out: string | null;
  clock_out_comment: string | null;
  created_at: string;
  hours_worked: number | string | null;
  id: number;
  location: string;
  overtime: number | string | null;
  status: string;
  tenant_id: number;
  updated_at: string;
  user_id: string;
}

interface AttendanceSummary {
  total_working_days: number;
  days_present: number;
  days_absent: number;
  days_late: number;
  is_clocked_in: boolean;
  attendance: AttendanceRecord[];
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

interface Filters {
  page: string; 
  employee_name?: string;
  status?: string;
  job_title?: string;
}

interface PaginationProps {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}
