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
}

const initialState: DashboardState = {
  attendance: initialAttendanceData,
  dashboardDetails: null,
  employeeAttendance: [],
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
  },
});

export const {
  updateDashboardDetails,
  setEmployeeAttendance,
  updateAttendance,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
