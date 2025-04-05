// Redux/features/dashboardSlice.ts
import { EmployeeAttendanceData } from '@/src/types/attendance';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardResponse } from '@/src/types/dashboard';
import { initialAttendanceData } from '@/src/utils/initialData';

export interface DashboardState {
  // Add export here
  dashboardDetails: DashboardResponse['data'] | null;
  employeeAttendance: EmployeeAttendanceData[];
  attendance: AttendanceSummary;
  employeeAttendancePagination: Pagination;
  filters: Filters;
}

const initialState: DashboardState = {
  attendance: initialAttendanceData,
  dashboardDetails: null,
  employeeAttendance: [],
  employeeAttendancePagination: {} as Pagination,
  filters: {
    page: '1',
    employee_name: '',
    status: '',
    job_title: '',
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateDashboardDetails: (
      state,
      action: PayloadAction<DashboardResponse['data']>
    ) => {
      state.dashboardDetails = action.payload;
    },
    setEmployeeAttendance: (
      state,
      action: PayloadAction<EmployeeAttendanceData[]>
    ) => {
      state.employeeAttendance = action.payload;
    },
    updateAttendance: (state, action: PayloadAction<AttendanceSummary>) => {
      state.attendance = action.payload;
    },
    setEmployeeAttendancePagination: (
      state,
      action: PayloadAction<Pagination>
    ) => {
      state.employeeAttendancePagination = action.payload;
    },
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },
  },
});

export const {
  updateDashboardDetails,
  setEmployeeAttendance,
  updateAttendance,
  setEmployeeAttendancePagination,
  setFilters,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
