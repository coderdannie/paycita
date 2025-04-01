export const initialUser: LoggedInUserProps = {
  birthday: false,
  company_logo: '',
  currency: '',
  email: '',
  feature: null,
  full_name: '',
  id: '',
  phone_number: '',
  role: '',
};

export const initialAttendanceData: AttendanceSummary = {
  total_working_days: 0,
  days_present: 0,
  days_absent: 0,
  days_late: 0,
  is_clocked_in: false,
  attendance: [],
};
