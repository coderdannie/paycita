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
