"use client";
import DashboardHeader from "./DashboardHeader/dashboardHearder";
import EmployeeTable from "./EmployeeTable/employeeTable";
import EventsCard from "./EventsCard/eventsCard";
import MetricCard from "./MetricCard/metricCard";

interface Metric {
  label: string;
  value: number;
  color?: "purple" | "lightpurple" | "gray";
}

const Page = () => {
  const attendanceMetrics: Metric[] = [
    { label: "On Time", value: 128, color: "purple" },
    { label: "Late Attendance", value: 76, color: "lightpurple" },
    { label: "Missed Attendance", value: 26, color: "gray" },
  ];

  const leaveMetrics: Metric[] = [
    { label: "Annual Leave", value: 128, color: "purple" },
    { label: "Maternity Leave", value: 76, color: "lightpurple" },
    { label: "Sick Leave", value: 26, color: "gray" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      <DashboardHeader />

      <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        <MetricCard title="Attendance" metrics={attendanceMetrics} />
        <MetricCard title="Leave overview" metrics={leaveMetrics} />
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
