export type MyAttendanceRecord = {
  date: string;
  clockIn: string;
  clockOut: string;
  location: string;
  status: 'Present' | 'Absent';
};
