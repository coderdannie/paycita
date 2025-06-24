// types/dashboard.ts
export interface Event {
  id: number;
  tenant_id: number;
  event_name: string;
  description: string;
  date: string;
  time: string;
  meeting_link: string;
  participants: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveInfo {
  leave_type: string;
  days_left: string;
}

export interface BirthdayCelebrant {
  user_id: string;
  full_name: string;
  profile_picture: string;
  department: string;
}

export interface Employee {
  full_name: string;
  job_title: string;
  job_level: string;
  employee_status: string;
}

export interface DashboardResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    attendance_week: string;
    attendance: {
      present: number;
      late: number;
      absent: number;
    };
    events: {
      event_today: Event[];
      event_tomorrow: Event[];
      leave: LeaveInfo;
      birthday_celebrant: BirthdayCelebrant[];
    };
    employee: Employee[];
  };
}

export interface UserBasicDetails {
  full_name: string;
  email: string;
  phone_number: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  marital_status: string;
  branch_id?: string;
  department_id?: string;
}

export interface UpdateBasicEmployeePayload {
  userId: string;
  data: UserBasicDetails;
}

export interface FirstGuarantor {
  guarantor_1_name: string;
  guarantor_1_relationship: string; // or use specific union type
  guarantor_1_phone: string;
  guarantor_1_address: string;
}
export interface SecondGuarantor {
  guarantor_2_name: string;
  guarantor_2_relationship: string; // or use specific union type
  guarantor_2_phone: string;
  guarantor_2_address: string;
}

export interface EmergencyContact {
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
}

export interface JobDetails {
  job_title: string;
  job_level: string;
  department_id: number;
  branch_id: number;
  employment_type: string;
  job_location: string;
  hire_date: string;
}

export interface CompensationDetails {
  salary: `${number}`; // Ensures string contains only numbers
  tax_status: string;
  pension_number: string;
  pension_company: string;
}

export type ResolvedAccountDetails = {
  account_number: string;
  account_name: string;
  bank_id: number;
};

export type ErrorMeta = {
  nextStep?: string;
  [key: string]: any;
};

type AccountResolutionResult = {
  status: boolean;
  message: string;
  data?: ResolvedAccountDetails;
  meta?: ErrorMeta;
  type?: string;
  code?: string;
};

export type ResolveAccountNameResponse = {
  status: number;
  success: boolean;
  message: string;
  data: AccountResolutionResult[];
  pagination: null;
};
