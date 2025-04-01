'use client';
import { useDashboardSelector } from '@/src/Redux/selectors';
import DashboardHeader from './DashboardHeader/dashboardHearder';
import EmployeeTable from './EmployeeTable/employeeTable';
import EventsCard from './EventsCard/eventsCard';
import MetricCard from './MetricCard/metricCard';
import { useDashboard } from '@/src/context/dashboardContext';
import { DashboardResponse } from '@/src/types/dashboard';
import { Skeleton } from '@/src/components/ui/skeleton';

interface Metric {
  label: string;
  value: number;
  color?: 'purple' | 'lightpurple' | 'gray';
}
type AttendanceType = DashboardResponse['data']['attendance'];

const Page = () => {
  const { dashboardDetails } = useDashboardSelector();
  const { isDashboardDetailsFetching } = useDashboard();
  const attendance = dashboardDetails?.attendance as AttendanceType;

  const attendanceMetrics: Metric[] = [
    { label: 'On Time', value: attendance?.present, color: 'purple' },
    {
      label: 'Late Attendance',
      value: attendance?.late,
      color: 'lightpurple',
    },
    {
      label: 'Missed Attendance',
      value: attendance?.absent,
      color: 'gray',
    },
  ];

  const leaveMetrics: Metric[] = [
    { label: 'Annual Leave', value: 128, color: 'purple' },
    { label: 'Maternity Leave', value: 76, color: 'lightpurple' },
    { label: 'Sick Leave', value: 234, color: 'gray' },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      <DashboardHeader />

      <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        {isDashboardDetailsFetching ? (
          <Skeleton className="h-[290px]  rounded-xl" />
        ) : (
          <MetricCard title="Attendance" metrics={attendanceMetrics} />
        )}
        {isDashboardDetailsFetching ? (
          <Skeleton className="h-[290px]  rounded-xl" />
        ) : (
          <MetricCard title="Leave overview" metrics={leaveMetrics} />
        )}
      </div>

      <div className="w-full p-4 flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <EmployeeTable />
        </div>
        <div className="w-full">
          <EventsCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
