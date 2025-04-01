'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useApiRequest from '../api/hooks/useApiRequest';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  setEmployeeAttendance,
  updateAttendance,
  updateDashboardDetails,
} from '../Redux/features/dashboardSlice';
import { updateDateTime } from '../utils/helper';

interface DashboardContextType {
  fetchDashboardDetails: () => Promise<void>;
  isDashboardDetailsFetching: boolean;
  isAttendanceLoading: boolean;
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
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isDashboardDetailsFetching, setIsDashboardDetailsFetching] =
    useState(false);

  const fetchDashboardDetails = useCallback(async () => {
    try {
      setIsDashboardDetailsFetching(true);
      await getRequest('hr/dashboard', (response) => {
        if (response.success) {
          dispatch(updateDashboardDetails(response.data));
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard details:', error);
    } finally {
      setIsDashboardDetailsFetching(false);
    }
  }, [dispatch, getRequest]);

  const handleGetAttendance = async () =>
    fetchAttendance('/hr/employee-attendance', (data) => {
      if (data.success) {
        dispatch(setEmployeeAttendance(data.data));
      }
    });

  const getAttendance = async () =>
    await fetchAttendance('/hr/attendance', (data) => {
      if (data.success) {
        dispatch(updateAttendance(data.data));
      }
    });

  const handleClockOut = async () =>
    await clockOut('/hr/attendance/clock-out', {}, (data) => {
      if (data.success) {
        getAttendance();
      }
    });

  const handleClockIn = async () =>
    await clockIn('/hr/attendance/clock-in', {}, (data) => {
      if (data.success) {
        getAttendance();
      }
    });

  const loadData = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/');
    } else {
      handleGetAttendance();
      getAttendance();
      fetchDashboardDetails();
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const update = () => {
      const date = updateDateTime();
      setCurrentDateTime(date);
      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000;
      timeoutId = setTimeout(update, msUntilNextMinute);
    };

    update();

    return () => {
      clearTimeout(timeoutId);
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
