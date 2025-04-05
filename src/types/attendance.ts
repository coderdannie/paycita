export type MyAttendanceRecord = {
  date: string;
  clockIn: string;
  clockOut: string;
  location: string;
  status: "Present" | "Absent";
};
export type SingleValue = {
  value: string;
  label: string;
};

export interface EmployeeAttendanceData {
  id: number;
  attendance_date: string;
  employee_name: string;
  job_title: string;
  clock_in: string;
  clock_out: string;
  location: string;
  overtime: string;
  hours_worked: string;
  clock_out_comment: string;
  created_at: string;
  status: string;
}

// export interface AddEmployee {
//   full_name: string;
//   email: string;
//   phone_number: string;
//   gender: string;
//   date_of_birth: string;
//   marital_status: string;
//   address: string;
//   emergency_contact_name: string;
//   emergency_contact_relationship: string;
//   emergency_contact_phone: string;
//   job_title: string;
//   job_level: string;
//   employment_type: string;
//   job_location: string;
//   hire_date: string;
//   salary: string;
//   role: string;
// }
