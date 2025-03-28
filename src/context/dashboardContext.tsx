"use client";
import { createContext, useContext, useEffect } from "react";
import useApiRequest from "../api/hooks/useApiRequest";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setEmployeeAttendance } from "../Redux/features/dashboardSlice";

interface DashboardContextType {
	isAttendanceLoading: boolean;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined
);

const DashboardProvider = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const { loading: isAttendanceLoading, getRequest: fetchAttendance } =
		useApiRequest();
	const router = useRouter();
	const dispatch = useDispatch();

	const handleGetAttendance = async () =>
		fetchAttendance("/hr/employee-attendance", (data) => {
			if (data.success) {
				dispatch(setEmployeeAttendance(data.data));
			}
		});

	const loadData = () => {
		const token = localStorage.getItem("access_token");
		if (!token) {
			router.replace("/");
		} else {
			handleGetAttendance();
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const value: DashboardContextType = {
		isAttendanceLoading,
	};
	return (
		<DashboardContext.Provider value={value}>
			{children}
		</DashboardContext.Provider>
	);
};

export const useDashboard = () => {
	return useContext(DashboardContext) as DashboardContextType;
};

export default DashboardProvider;
