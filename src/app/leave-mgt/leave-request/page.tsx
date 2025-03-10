'use client'
import React, { useState, useEffect } from "react";
import Filters from "./Filters/filters";
import LeaveRequestTable from "./LeaveRequestTable/leaveRequestTable";


const LeaveRequest: React.FC = () => {
  const allLeaveRequests: LeaveRequestType[] = [
    {
      id: 1,
      requestDate: "Thu, 1 Aug 2024",
      employeeName: "Sarah Johnson",
      leaveType: "Annual Leave",
      leaveDate: "Mar 4 - Mar 13 2025",
      duration: 10,
      status: "Pending",
    },
    {
      id: 2,
      requestDate: "Thu, 1 Aug 2024",
      employeeName: "John Doe",
      leaveType: "Sick Leave",
      leaveDate: "Jan 10 - Jan 12 2025",
      duration: 3,
      status: "Approved",
    },
    {
      id: 3,
      requestDate: "Thu, 1 Aug 2024",
      employeeName: "Michael Lee",
      leaveType: "Personal Leave",
      leaveDate: "Dec 5 - Dec 7 2025",
      duration: 3,
      status: "Approved",
    },
    {
      id: 4,
      requestDate: "Thu, 1 Aug 2024",
      employeeName: "Laura Garcia",
      leaveType: "Maternity Leave",
      leaveDate: "Sep 1 - Sep 1 2025",
      duration: 90,
      status: "Approved",
    },    {
      id: 5,
      requestDate: "Thu, 1 Aug 2024",
      employeeName: "Sophie Anderson",
      leaveType: "Unpaid Leave",
      leaveDate: "Aug 15 - Aug 20 2025",
      duration: 6,
      status: "Rejected",
    },
  ];

  const [filteredRequests, setFilteredRequests] =
    useState<LeaveRequestType[]>(allLeaveRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let filtered = allLeaveRequests;

    // Filter by employee name
    if (searchTerm) {
      filtered = filtered.filter((request) =>
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by leave type
    if (leaveTypeFilter) {
      filtered = filtered.filter(
        (request) => request.leaveType === leaveTypeFilter
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, leaveTypeFilter, statusFilter, allLeaveRequests]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Request</h1>
      <Filters
        onSearchChange={setSearchTerm}
        onTypeChange={setLeaveTypeFilter}
        onStatusChange={setStatusFilter}
      />
      <LeaveRequestTable requests={filteredRequests} />
      {/* Pagination component would be used here */}
    </div>
  );
};

export default LeaveRequest;
