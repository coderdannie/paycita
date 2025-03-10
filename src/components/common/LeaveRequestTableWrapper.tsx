"use client";
import React, { useState } from "react";
import Pagination from "@/src/app/leave-mgt/Pagination/pagination";
import LeaveRequestTable from "@/src/app/leave-mgt/leave-request/LeaveRequestTable/leaveRequestTable";

interface LeaveRequest {
  id: number;
  requestDate: string;
  employeeName: string;
  leaveType: string;
  leaveDate: string;
  duration: number;
  status: "Pending" | "Approved" | "Rejected";
}

interface LeaveRequestTableWrapperProps {
  requests: LeaveRequest[];
}

const LeaveRequestTableWrapper: React.FC<LeaveRequestTableWrapperProps> = ({
  requests,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;
  const totalPages = Math.ceil(requests.length / requestsPerPage);

  const paginatedRequests = requests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <LeaveRequestTable requests={paginatedRequests} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default LeaveRequestTableWrapper;
