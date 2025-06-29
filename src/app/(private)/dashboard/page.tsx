'use client';
import { useDashboardSelector } from '@/src/Redux/selectors';
import DashboardHeader from './DashboardHeader/dashboardHearder';
import EmployeeTable from './EmployeeTable/employeeTable';
import EventsCard from './EventsCard/eventsCard';
import MetricCard from './MetricCard/metricCard';
import { useDashboard } from '@/src/context/dashboardContext';
import { DashboardResponse, LeaveOverview } from '@/src/types/dashboard';
import { Skeleton } from '@/src/components/ui/skeleton';
import { formatLabel } from '@/src/utils/helper';

interface Metric {
  label: string;
  value: number;
  color?: 'purple' | 'lightpurple' | 'gray';
}
type AttendanceType = DashboardResponse['data']['attendance'];
type LeaveType = DashboardResponse['data']['leave_overview'];

const Page = () => {
  const { dashboardDetails } = useDashboardSelector();
  const { isDashboardDetailsFetching } = useDashboard();
  const attendance = dashboardDetails?.attendance as AttendanceType;
  const leaveOverview = dashboardDetails?.leave_overview as LeaveType;

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

  const getColorForLeaveType = (
    leaveType: string
  ): 'purple' | 'lightpurple' | 'gray' => {
    const colorMap: Record<string, 'purple' | 'lightpurple' | 'gray'> = {
      'annual leave': 'purple',
      'sick leave': 'gray',
      'maternity leave': 'lightpurple',
    };
    return colorMap[leaveType.toLowerCase()] || 'purple';
  };

  const leaveMetrics: Metric[] = leaveOverview?.map((item: LeaveOverview) => ({
    label: formatLabel(item.leave_type),
    value: parseInt(item.total, 10),
    color: getColorForLeaveType(item.leave_type),
  }));

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      <DashboardHeader />

      <div className="w-full py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        {isDashboardDetailsFetching ? (
          <Skeleton className="h-[290px]  rounded-xl" />
        ) : (
          <MetricCard title="Attendance" metrics={attendanceMetrics} />
        )}
        {isDashboardDetailsFetching ? (
          <Skeleton className="h-[290px]  rounded-xl" />
        ) : (
          <MetricCard title="" metrics={leaveMetrics} />
        )}
      </div>

      <div className="w-full py-4  grid md:[grid-template-columns:2fr_1fr] items-center gap-4 ">
        <EmployeeTable />
        <EventsCard />
      </div>
    </div>
  );
};

export default Page;
