import {
  AttendanceIcon,
  DashboardIcon,
  EmployeeMgtIcon,
  LeaveMgtIcon,
  PayRollIcon,
  SettingsIcon,
} from '@/src/assets/Icons';
import { MyAttendanceRecord } from '@/src/types/attendance';

export const sidebarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon fill="#344054" />,
    sec: <DashboardIcon fill="#692E9F" />,
    hover: <DashboardIcon fill="#692E9F" />,
  },
  {
    title: 'Attendance',
    icon: <AttendanceIcon fill="#344054" />,
    sec: <AttendanceIcon fill="#692E9F" />,
    hover: <AttendanceIcon fill="#692E9F" />,
    path: '/attendance',
    sub: [
      {
        id: 1,
        name: 'My Attendance',
        path: '/attendance/my-attendance',
      },
      {
        id: 2,
        name: 'Employee Attendance ',
        path: '/attendance/employee-attendance',
      },
    ],
  },
  {
    title: 'Payroll',
    icon: <PayRollIcon fill="#344054" />,
    sec: <PayRollIcon fill="#692E9F" />,
    hover: <PayRollIcon fill="#692E9F" />,
    path: '/payroll',
    sub: [
      {
        id: 1,
        name: 'My Payroll',
        path: '/payroll/my-payroll',
      },
      {
        id: 2,
        name: 'Employee Payroll',
        path: '/payroll/employee-payroll',
      },
    ],
  },

  {
    title: 'Employee Management',
    icon: <EmployeeMgtIcon fill="#344054" />,
    sec: <EmployeeMgtIcon fill="#692E9F" />,
    hover: <EmployeeMgtIcon fill="#692E9F" />,
    path: '/employee-mgt',
  },
  {
    title: 'Leave Management',
    icon: <LeaveMgtIcon fill="#344054" />,
    sec: <LeaveMgtIcon fill="#692E9F" />,
    hover: <LeaveMgtIcon fill="#692E9F" />,
    path: '/leave-mgt',
  },

  {
    title: 'Settings',
    icon: <SettingsIcon fill="#344054" />,
    sec: <SettingsIcon fill="#692E9F" />,
    hover: <SettingsIcon fill="#692E9F" />,
    path: '/settings',
  },
];

export const attendanceCount: { title: string; value: string }[] = [
  {
    title: 'Total  Working Days',
    value: '21',
  },
  {
    title: 'Days Present',
    value: '21',
  },
  {
    title: 'Days Absences',
    value: '21',
  },
];

export const myAttendanceTableData: MyAttendanceRecord[] = [
  {
    date: 'Wed, 29 Jan 2025',
    clockIn: '08:20',
    clockOut: '17:46',
    location: 'Lagos',
    status: 'Present',
  },
  {
    date: 'Tue, 28 Jan 2025',
    clockIn: '08:20',
    clockOut: '17:46',
    location: 'Lagos',
    status: 'Present',
  },
  {
    date: 'Mon, 27 Jan 2025',
    clockIn: '08:20',
    clockOut: '17:46',
    location: 'Lagos',
    status: 'Present',
  },
  {
    date: 'Fri, 24 Jan 2025',
    clockIn: '08:20',
    clockOut: '17:46',
    location: 'Lagos',
    status: 'Absent',
  },
  {
    date: 'Thu, 23 Jan 2025',
    clockIn: '08:20',
    clockOut: '17:46',
    location: 'Lagos',
    status: 'Present',
  },
  {
    date: 'Wed, 22 Jan 2025',
    clockIn: '08:20',
    clockOut: '17:46',
    location: 'Lagos',
    status: 'Present',
  },
  {
    date: 'Tue, 21 Jan 2025',
    clockIn: '08:20',
    clockOut: '17:46',
    location: 'Lagos',
    status: 'Absent',
  },
  {
    date: 'Mon, 20 Jan 2025',
    clockIn: '08:20',
    clockOut: '17:46',
    location: 'Lagos',
    status: 'Present',
  },
];
export const employeeDetailsTabs = [
  'Personal Info',
  'Employee Details',
  'Attendance',
  'Payroll History',
  'Leave History',
];
