"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useApiRequest from "../api/hooks/useApiRequest";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  updateAttendance,
  updateDashboardDetails,
} from "../Redux/features/dashboardSlice";
import { updateDateTime } from "../utils/helper";
import { useGetAttendance } from "../api/hooks/dashboard/useDashboard";
import { useDashboardSelector } from "../Redux/selectors";
import { ToastProvider } from "./ToastContext";

interface DashboardContextType {
  fetchDashboardDetails: () => Promise<void>;
  isDashboardDetailsFetching: boolean;
  isAttendanceLoading: boolean;
  isEmployeeAttendanceLoading: boolean;

  handleClockOut: () => void;
  handleClockIn: () => void;
  isClockingIn: boolean;
  isClockingOut: boolean;
  currentDateTime: string;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const DashboardProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { loading: isAttendanceLoading, getRequest: fetchAttendance } =
    useApiRequest();

  const { postRequest: clockIn, loading: isClockingIn } = useApiRequest();
  const { postRequest: clockOut, loading: isClockingOut } = useApiRequest();
  const { getRequest } = useApiRequest();
  const { filters } = useDashboardSelector();
  const router = useRouter();

  const { isPending: isEmployeeAttendanceLoading } = useGetAttendance(filters);

  const dispatch = useDispatch();
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isDashboardDetailsFetching, setIsDashboardDetailsFetching] =
    useState(false);

  const fetchDashboardDetails = useCallback(async () => {
    try {
      setIsDashboardDetailsFetching(true);
      await getRequest("hr/dashboard", (response) => {
        if (response.success) {
          dispatch(updateDashboardDetails(response.data));
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard details:", error);
    } finally {
      setIsDashboardDetailsFetching(false);
    }
  }, [dispatch, getRequest]);

  // const handleGetAttendance = async () =>
  //   fetchAttendance("/hr/employee-attendance", (data) => {
  //     if (data.success) {
  //       dispatch(
  //         setEmployeeAttendance(
  //           Array.isArray(data.data) ? data.data : [data.data]
  //         )
  //       );
  //       dispatch(setEmployeeAttendancePagination(data.pagination));
  //     }
  //   });

  const getAttendance = async () =>
    await fetchAttendance("/hr/attendance", (data) => {
      if (data.success) {
        dispatch(updateAttendance(data.data));
      }
    });

  const handleClockOut = async () =>
    await clockOut("/hr/attendance/clock-out", {}, (data) => {
      if (data.success) {
        getAttendance();
      }
    });

  const handleClockIn = async () =>
    await clockIn("/hr/attendance/clock-in", {}, (data) => {
      if (data.success) {
        getAttendance();
      }
    });

  const loadData = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/");
    } else {
      // handleGetAttendance();
      getAttendance();
      fetchDashboardDetails();
    }
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;

    const update = () => {
      const date = updateDateTime();
      setCurrentDateTime(date);
      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000;
      timeoutId = setTimeout(update, msUntilNextMinute);
    };

    // Initial update
    update();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const value: DashboardContextType = {
    isAttendanceLoading,
    handleClockIn,
    handleClockOut,
    isClockingIn,
    isClockingOut,
    currentDateTime,
    isDashboardDetailsFetching,
    fetchDashboardDetails,
    isEmployeeAttendanceLoading,
  };
  return (
    <DashboardContext.Provider value={value}>
      <ToastProvider>{children}</ToastProvider>
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  return useContext(DashboardContext) as DashboardContextType;
};

export default DashboardProvider;
