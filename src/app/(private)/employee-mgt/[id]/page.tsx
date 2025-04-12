"use client";

import { useState } from "react";
import { employeeDetailsTabs } from "@/src/components/common/constants";
import PersonalInfo from "@/src/components/data/EmployeeMgt/Tabs/PersonalInfo";
import EmployeeDetail from "@/src/components/data/EmployeeMgt/Tabs/EmployeeDetails";
import Attendance from "@/src/components/data/EmployeeMgt/Tabs/Attendance";
import PayrollHistory from "@/src/components/data/EmployeeMgt/Tabs/PaymentHistory";
import LeaveHistory from "@/src/components/data/EmployeeMgt/Tabs/LeaveHistory";
import { useGetEmployeeById } from "@/src/api/hooks/dashboard/useDashboard";
import { useParams } from "next/navigation";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import Documents from "@/src/components/data/EmployeeMgt/Tabs/Documents";
import OffBoarding from "@/src/components/data/EmployeeMgt/Tabs/OffBoarding";

const EmployeeDetails = () => {
  const [tab, setTab] = useState(employeeDetailsTabs[0]);

  const { id } = useParams();
  const employeeId = id as string;

  const { employee, isPending } = useGetEmployeeById(employeeId || "");

  if (isPending) {
    return <LoadingOverlay />;
  }
  if (!employee) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Employee not found
      </div>
    );
  }

  return (
    <div>
      <div className="flex text-xs gap-1">
        <div className="text-primary ">
          <p>Employee Management</p>{" "}
        </div>
        <p className="text-[#667085]">
          / {employee?.employee?.full_name ?? "N/A"}
        </p>
      </div>
      <h3 className="font-bold text-[#1D2939] pt-2 text-lg md:text-xl">
        Detail Employee
      </h3>
      <ul className="pt-5  flex flex-col md:flex-row items-center gap-5 text-sm border-[#E4E7EC] border-b">
        {employeeDetailsTabs?.map((dat, i) => (
          <li
            key={i}
            className={`py-3 cursor-pointer ${
              tab === dat
                ? "text-primary border-b-[3px] border-primary"
                : "text-[#667085] "
            }`}
            onClick={() => setTab(dat)}
          >
            {dat}
          </li>
        ))}
      </ul>
      <div className=" mt-9">
        {tab.includes("Personal") ? (
          <PersonalInfo user={employee?.employee} />
        ) : tab.includes("Employee") ? (
          <EmployeeDetail userDetails={employee?.employee} />
        ) : tab.includes("Attendance") ? (
          <Attendance attendance={employee?.attendance} />
        ) : tab.includes("Payroll") ? (
          <PayrollHistory />
        ) : tab.includes("Leave") ? (
          <LeaveHistory leave={employee?.leave} />
        ) : tab.includes("Documents") ? (
          <Documents documents={employee?.document} />
        ) : (
          <OffBoarding
            itemsGiven={employee?.employee?.office_items_given ?? {}}
            status={employee?.employee?.status}
          />
        )}
      </div>
    </div>
  );
};
export default EmployeeDetails;
