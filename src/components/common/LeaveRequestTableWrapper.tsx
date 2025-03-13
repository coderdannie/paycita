"use client";
import Pagination from "@/src/app/(private)/leave-mgt/Pagination/pagination";
import React, { useState } from "react";


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
      <table className="w-full">
        <thead>
          <tr>
            <th>Request Date</th>
            <th>Employee Name</th>
            <th>Leave Type</th>
            <th>Leave Date</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.requestDate}</td>
              <td>{request.employeeName}</td>
              <td>{request.leaveType}</td>
              <td>{request.leaveDate}</td>
              <td>{request.duration}</td>
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
