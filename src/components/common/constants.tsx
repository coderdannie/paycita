import {
  AttendanceIcon,
  BillsPaymentIcon,
  DashboardIcon,
  EmployeeMgtIcon,
  EventIcon,
  ExpenseIcon,
  LeaveMgtIcon,
  PayRollIcon,
  SettingsIcon,
  ProcurementIcon,
  MessageIcon,
  LoanIcon,
  AppraisalIcon,
  ApprovalIcon,
  WalletIcon,
  ReimbursementIcon,
  AssetMgtIcon,
  AllExpensesIcon,
  TaskMgtIcon,
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
    title: 'Procurement',
    icon: <ProcurementIcon fill="#344054" />,
    sec: <ProcurementIcon fill="#692E9F" />,
    hover: <ProcurementIcon fill="#692E9F" />,
    path: '/procurement',
  },
  {
    title: 'Employee Management',
    icon: <EmployeeMgtIcon fill="#344054" />,
    sec: <EmployeeMgtIcon fill="#692E9F" />,
    hover: <EmployeeMgtIcon fill="#692E9F" />,
    path: '/employee-mgt',
  },
  {
    title: 'Asset Management',
    icon: <AssetMgtIcon fill="#344054" />,
    sec: <AssetMgtIcon fill="#692E9F" />,
    hover: <AssetMgtIcon fill="#692E9F" />,
    path: '/asset-management',
  },
  {
    title: 'Expense Management',
    icon: <ExpenseIcon fill="#344054" />,
    sec: <ExpenseIcon fill="#692E9F" />,
    hover: <ExpenseIcon fill="#692E9F" />,
    path: '/expense-mgt',
  },
  {
    title: 'All Expenses',
    icon: <AllExpensesIcon fill="#344054" />,
    sec: <AllExpensesIcon fill="#692E9F" />,
    hover: <AllExpensesIcon fill="#692E9F" />,
    path: '/all-expenses',
    sub: [
      {
        id: 1,
        name: 'All Purchase Expenses',
        path: '/all-expenses/all-purchase',
      },
      {
        id: 2,
        name: 'All Procurement',
        path: '/all-expenses/all-procurements',
      },
      {
        id: 3,
        name: 'All Reimbursement',
        path: '/all-expenses/all-reimbursement',
      },
    ],
  },
  {
    title: 'Leave Management',
    icon: <LeaveMgtIcon fill="#344054" />,
    sec: <LeaveMgtIcon fill="#692E9F" />,
    hover: <LeaveMgtIcon fill="#692E9F" />,
    path: '/leave-mgt',
    sub: [
      {
        id: 1,
        name: 'My Leave Request',
        path: '/leave-mgt/my-leave-request',
      },
      {
        id: 2,
        name: 'Employee Leave Request',
        path: '/leave-mgt/employee-leave-request',
      },
    ],
  },
  {
    title: 'Appraisals',
    icon: <AppraisalIcon fill="#344054" />,
    hover: <AppraisalIcon fill="#692E9F" />,
    path: '/appraisals',
  },
  {
    title: 'Event',
    icon: <EventIcon fill="#344054" />,
    sec: <EventIcon fill="#692E9F" />,
    hover: <EventIcon fill="#692E9F" />,
    path: '/event',
  },
  {
    title: 'Bill Payment',
    icon: <BillsPaymentIcon fill="#344054" />,
    sec: <BillsPaymentIcon fill="#692E9F" />,
    hover: <BillsPaymentIcon fill="#692E9F" />,
    path: '/bill-payment',
  },
  {
    title: 'Loan',
    icon: <LoanIcon fill="#344054" />,
    sec: <LoanIcon fill="#692E9F" />,
    hover: <LoanIcon fill="#692E9F" />,
    path: '/loan',
  },
  {
    title: 'Message',
    icon: <MessageIcon fill="#344054" />,
    sec: <MessageIcon fill="#692E9F" />,
    hover: <MessageIcon fill="#692E9F" />,
    path: '/message',
  },
  {
    title: 'Wallet',
    icon: <WalletIcon fill="#344054" />,
    sec: <WalletIcon fill="#692E9F" />,
    hover: <WalletIcon fill="#692E9F" />,
    path: '/wallet',
  },
  {
    title: 'Approval',
    icon: <ApprovalIcon fill="#344054" />,
    sec: <ApprovalIcon fill="#692E9F" />,
    hover: <ApprovalIcon fill="#692E9F" />,
    path: '/approval',
    sub: [
      {
        id: 1,
        title: 'Leave',
        name: 'Leave',
        path: '/approval/leave',
      },
      {
        id: 2,
        title: 'Expense',
        name: 'Expense',
        path: '/approval/expense',
      },
      {
        id: 3,
        title: 'Reimbursement',
        name: 'Reimbursement Management',
        path: '/approval/reimbursement-mgt',
      },
    ],
  },
  {
    title: 'Reimbursement',
    icon: <ReimbursementIcon fill="#344054" />,
    sec: <ReimbursementIcon fill="#692E9F" />,
    hover: <ReimbursementIcon fill="#692E9F" />,
    path: '/add-reimbursement',
  },
  // {
  //   title: 'Task Management',
  //   icon: <TaskMgtIcon fill="#344054" />,
  //   sec: <TaskMgtIcon fill="#692E9F" />,
  //   hover: <TaskMgtIcon fill="#692E9F" />,
  //   path: '/task-management',
  // },
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
    title: 'Days Absent',
    value: '21',
  },
  {
    title: 'Days late',
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
  'Documents',
  'Password',
  'Off Boarding',
];

export const ITEMS = ['Id card', 'Laptop', 'Accommodation', 'Phone'];

export const expenseHeaders = [
  'Item',
  'Description',
  'Qty',
  'Unit Price',
  'Total Cost',
  '',
];

export const COLORS = {
  pry: '#692E9F',
  sec: '#F0EAF5',
  gray_0: 'rgba(255, 255, 255, 1)',
  gray_1: 'rgba(250, 250, 250, 1)',
  gray_2: 'rgba(210, 210, 210, 1)',
  gray_3: 'rgba(170, 170, 170, 1)',
  gray_4: 'rgba(131, 131, 131, 1)',
  gray_5: 'rgba(33, 33, 33, 1)',
  white: '#fffff',
  red_pry: '#C12121',
  green_pry: '#21A366',
  darkBg: '#FFFFFF0A',
  lightBg: '#0000000A',
  borderLight: '#00000029',
  borderDark: '#FFFFFF29',
  yellow_pry: '#FFEE00',
  black_pry: '#344054',
};

export const walletCounts = (item: {
  wallet_credit: string;
  wallet_debit: string;
  wallet_balance: string;
}): { title: string; amount: string }[] => [
  {
    title: 'Total Credit',
    amount: item?.wallet_credit || '0.00',
  },
  {
    title: 'Total Spent',
    amount: item?.wallet_debit || '0.00',
  },
  {
    title: 'Remaining Balance',
    amount: item?.wallet_balance || '0.00',
  },
];

export const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'pending', label: 'Pending' },
] as const;

export const priorities = [
  { value: 'priority', label: 'Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const taskData = [
  {
    id: 1,
    title: 'Audit petty cash usage',
    description:
      'Review petty cash logs. Check receipts and ensure amounts are accurate.',
    priority: 'High',
    startDate: '2/7/2025',
    dueDate: '2/8/2025',
    status: 'todo',
    progress: 0,
    assignees: [
      {
        id: 1,
        name: 'Adewale dada',
        avatar: 'https://i.pravatar.cc/32?img=1',
        department: 'IT department',
      },
      {
        id: 2,
        name: 'Ewejide Taiwo',
        avatar: 'https://i.pravatar.cc/32?img=2',
        department: 'IT department',
      },
      {
        id: 3,
        name: 'Bunmi Tanny',
        avatar: 'https://i.pravatar.cc/32?img=3',
        department: 'IT department',
      },
    ],
    taskOutlines: [
      {
        id: 1,
        text: 'This is the first requirement for this task',
        completed: true,
      },
      {
        id: 2,
        text: 'This is the second requirement for this task',
        completed: false,
      },
      {
        id: 3,
        text: 'This is the third requirement for this task',
        completed: false,
      },
    ],
    activities: [
      {
        id: 1,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'changed the status',
        from: 'TO-DO',
        to: 'In Progress',
        timestamp: '5 minutes ago',
        type: 'status',
      },
      {
        id: 2,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'Dropped a comment',
        comment: 'Me did not understand this second requirement o',
        timestamp: '5 minutes ago',
        type: 'comment',
      },
    ],
  },
  {
    id: 2,
    title: 'Create login for new staff',
    description:
      'Set up system access for new hires and assign the correct role.',
    priority: 'Medium',
    startDate: '2/7/2025',
    dueDate: '2/8/2025',
    status: 'todo',
    progress: 0,
    assignees: [
      {
        id: 1,
        name: 'Adewale dada',
        avatar: 'https://i.pravatar.cc/32?img=1',
        department: 'IT department',
      },
      {
        id: 2,
        name: 'Ewejide Taiwo',
        avatar: 'https://i.pravatar.cc/32?img=2',
        department: 'IT department',
      },
      {
        id: 3,
        name: 'Bunmi Tanny',
        avatar: 'https://i.pravatar.cc/32?img=3',
        department: 'IT department',
      },
    ],
    taskOutlines: [
      {
        id: 1,
        text: 'This is the first requirement for this task',
        completed: true,
      },
      {
        id: 2,
        text: 'This is the second requirement for this task',
        completed: false,
      },
      {
        id: 3,
        text: 'This is the third requirement for this task',
        completed: false,
      },
    ],
    activities: [
      {
        id: 1,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'changed the status',
        from: 'TO-DO',
        to: 'In Progress',
        timestamp: '5 minutes ago',
        type: 'status',
      },
      {
        id: 2,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'Dropped a comment',
        comment: 'Me did not understand this second requirement o',
        timestamp: '5 minutes ago',
        type: 'comment',
      },
    ],
  },
  {
    id: 3,
    title: 'Audit petty cash usage',
    description:
      'Review petty cash logs. Check receipts and ensure amounts are accurate.',
    priority: 'Low',
    startDate: '2/7/2025',
    dueDate: '2/8/2025',
    status: 'in progress',
    progress: 75,
    assignees: [
      {
        id: 1,
        name: 'Adewale dada',
        avatar: 'https://i.pravatar.cc/32?img=1',
        department: 'IT department',
      },
      {
        id: 2,
        name: 'Ewejide Taiwo',
        avatar: 'https://i.pravatar.cc/32?img=2',
        department: 'IT department',
      },
      {
        id: 3,
        name: 'Bunmi Tanny',
        avatar: 'https://i.pravatar.cc/32?img=3',
        department: 'IT department',
      },
    ],
    taskOutlines: [
      {
        id: 1,
        text: 'This is the first requirement for this task',
        completed: true,
      },
      {
        id: 2,
        text: 'This is the second requirement for this task',
        completed: false,
      },
      {
        id: 3,
        text: 'This is the third requirement for this task',
        completed: false,
      },
    ],
    activities: [
      {
        id: 1,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'changed the status',
        from: 'TO-DO',
        to: 'In Progress',
        timestamp: '5 minutes ago',
        type: 'status',
      },
      {
        id: 2,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'Dropped a comment',
        comment: 'Me did not understand this second requirement o',
        timestamp: '5 minutes ago',
        type: 'comment',
      },
    ],
  },
  {
    id: 4,
    title: 'Audit petty cash usage',
    description:
      'Review petty cash logs. Check receipts and ensure amounts are accurate.',
    priority: 'High',
    startDate: '2/7/2025',
    dueDate: '2/8/2025',
    status: 'in progress',
    progress: 50,
    assignees: [
      {
        id: 1,
        name: 'Adewale dada',
        avatar: 'https://i.pravatar.cc/32?img=1',
        department: 'IT department',
      },
      {
        id: 2,
        name: 'Ewejide Taiwo',
        avatar: 'https://i.pravatar.cc/32?img=2',
        department: 'IT department',
      },
      {
        id: 3,
        name: 'Bunmi Tanny',
        avatar: 'https://i.pravatar.cc/32?img=3',
        department: 'IT department',
      },
    ],
    taskOutlines: [
      {
        id: 1,
        text: 'This is the first requirement for this task',
        completed: true,
      },
      {
        id: 2,
        text: 'This is the second requirement for this task',
        completed: false,
      },
      {
        id: 3,
        text: 'This is the third requirement for this task',
        completed: false,
      },
    ],
    activities: [
      {
        id: 1,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'changed the status',
        from: 'TO-DO',
        to: 'In Progress',
        timestamp: '5 minutes ago',
        type: 'status',
      },
      {
        id: 2,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'Dropped a comment',
        comment: 'Me did not understand this second requirement o',
        timestamp: '5 minutes ago',
        type: 'comment',
      },
    ],
  },
  {
    id: 5,
    title: 'Audit petty cash usage',
    description:
      'Review petty cash logs. Check receipts and ensure amounts are accurate.',
    priority: 'High',
    startDate: '2/7/2025',
    dueDate: '2/8/2025',
    status: 'completed',
    progress: 100,
    assignees: [
      {
        id: 1,
        name: 'Adewale dada',
        avatar: 'https://i.pravatar.cc/32?img=1',
        department: 'IT department',
      },
      {
        id: 2,
        name: 'Ewejide Taiwo',
        avatar: 'https://i.pravatar.cc/32?img=2',
        department: 'IT department',
      },
      {
        id: 3,
        name: 'Bunmi Tanny',
        avatar: 'https://i.pravatar.cc/32?img=3',
        department: 'IT department',
      },
    ],
    taskOutlines: [
      {
        id: 1,
        text: 'This is the first requirement for this task',
        completed: true,
      },
      {
        id: 2,
        text: 'This is the second requirement for this task',
        completed: false,
      },
      {
        id: 3,
        text: 'This is the third requirement for this task',
        completed: false,
      },
    ],
    activities: [
      {
        id: 1,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'changed the status',
        from: 'TO-DO',
        to: 'In Progress',
        timestamp: '5 minutes ago',
        type: 'status',
      },
      {
        id: 2,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'Dropped a comment',
        comment: 'Me did not understand this second requirement o',
        timestamp: '5 minutes ago',
        type: 'comment',
      },
    ],
  },
  {
    id: 6,
    title: 'Audit petty cash usage',
    description:
      'Review petty cash logs. Check receipts and ensure amounts are accurate.',
    priority: 'Low',
    startDate: '2/7/2025',
    dueDate: '2/8/2025',
    status: 'completed',
    progress: 100,
    assignees: [
      { id: 1, name: 'John', avatar: 'https://i.pravatar.cc/32?img=1' },
      { id: 2, name: 'Jane', avatar: 'https://i.pravatar.cc/32?img=2' },
      { id: 3, name: 'Bob', avatar: 'https://i.pravatar.cc/32?img=3' },
    ],
    taskOutlines: [
      {
        id: 1,
        text: 'This is the first requirement for this task',
        completed: true,
      },
      {
        id: 2,
        text: 'This is the second requirement for this task',
        completed: false,
      },
      {
        id: 3,
        text: 'This is the third requirement for this task',
        completed: false,
      },
    ],
    activities: [
      {
        id: 1,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'changed the status',
        from: 'TO-DO',
        to: 'In Progress',
        timestamp: '5 minutes ago',
        type: 'status',
      },
      {
        id: 2,
        user: 'Bunmi',
        avatar: 'https://i.pravatar.cc/32?img=3',
        action: 'Dropped a comment',
        comment: 'Me did not understand this second requirement o',
        timestamp: '5 minutes ago',
        type: 'comment',
      },
    ],
  },
];

export const allUsers = [
  {
    id: 1,
    name: 'Adewale dada',
    avatar: 'https://i.pravatar.cc/32?img=1',
    department: 'IT department',
  },
  {
    id: 2,
    name: 'Ewejide Taiwo',
    avatar: 'https://i.pravatar.cc/32?img=2',
    department: 'IT department',
  },
  {
    id: 3,
    name: 'Bunmi Tanny',
    avatar: 'https://i.pravatar.cc/32?img=3',
    department: 'IT department',
  },
  {
    id: 4,
    name: 'Ademola',
    avatar: 'https://i.pravatar.cc/32?img=4',
    department: 'IT department',
  },
  {
    id: 5,
    name: 'Sarah',
    avatar: 'https://i.pravatar.cc/32?img=5',
    department: 'IT department',
  },
  {
    id: 6,
    name: 'Mike',
    avatar: 'https://i.pravatar.cc/32?img=6',
    department: 'IT department',
  },
];
