'use client';
import React, { useState, useMemo } from "react";
import Filters from "./Filters/filters";

import { LeaveRequestType } from "./types";
import { ToastProvider } from "../../../../context/ToastContext";
import EmployeeLeaveRequestTable from "./EmployeeLeaveRequestTable/employeeLeaveRequestTable";

const LeaveRequest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; 
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([
    {
      id: 1,
      requestDate: "2024-08-01",
      employeeName: "Sarah Johnson",
      leaveType: "Annual Leave",
      leaveDate: "2025-03-04 to 2025-03-13",
      duration: 10,
      status: "Pending",
    },
    {
      id: 2,
      requestDate: "2024-08-01",
      employeeName: "John Doe",
      leaveType: "Sick Leave",
      leaveDate: "2025-01-10 to 2025-01-12",
      duration: 3,
      status: "Approved",
    },
    {
      id: 3,
      requestDate: "2024-08-01",
      employeeName: "Michael Lee",
      leaveType: "Personal Leave",
      leaveDate: "2025-12-05 to 2025-12-07",
      duration: 3,
      status: "Approved",
    },
    {
      id: 4,
      requestDate: "2024-08-01",
      employeeName: "Laura Garcia",
      leaveType: "Maternity Leave",
      leaveDate: "2025-09-01 to 2025-11-30",
      duration: 90,
      status: "Approved",
    },
    {
      id: 5,
      requestDate: "2024-08-01",
      employeeName: "Sophie Anderson",
      leaveType: "Unpaid Leave",
      leaveDate: "2025-08-15 to 2025-08-20",
      duration: 6,
      status: "Rejected",
    },
  ]);

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((request) => {
      return (
        (!searchTerm ||
          request.employeeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (!leaveTypeFilter || request.leaveType === leaveTypeFilter) &&
        (!statusFilter || request.status === statusFilter)
      );
    });
  }, [searchTerm, leaveTypeFilter, statusFilter, leaveRequests]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleStatusUpdate = (
    id: number,
    newStatus: LeaveRequestType["status"]
  ) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ToastProvider>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Employee Leave Request</h1>
        <Filters
          onSearchChange={setSearchTerm}
          onTypeChange={setLeaveTypeFilter}
          onStatusChange={setStatusFilter}
        />
        <EmployeeLeaveRequestTable
          requests={filteredRequests}
          onStatusUpdate={handleStatusUpdate}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </ToastProvider>
  );
};
export default LeaveRequest;
