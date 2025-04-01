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
