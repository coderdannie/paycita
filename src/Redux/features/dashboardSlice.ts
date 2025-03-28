import { EmployeeAttendanceData } from "@/src/types/attendance";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DashboardState {
	employeeAttendance: EmployeeAttendanceData[];
}

const initialState: DashboardState = {
	employeeAttendance: [],
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		setEmployeeAttendance: (state, { payload }) => {
			state.employeeAttendance = payload;
		},
	},
});

export const { setEmployeeAttendance } = dashboardSlice.actions;
export default dashboardSlice.reducer;
