"use client";

import React, { useState } from "react";
import LeaveRequestButton from "./LeaveRequest/leaveRequest";
import LeaveSummary from "./LeaveSummary/leaveSummary";
import LeaveHistory from "./LeaveHistory/leaveHistory";
import LeaveRequestModal from "./LeaveRequestModal/leaveRequestModal";
import LeaveDetailsModal from "./LeaveDetailsModal/leaveDetailsModal";


interface Leave {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: "Approved" | "Rejected";
}

interface LeaveTypeInfo {
  type: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

const Page: React.FC = () => {
  const [showLeaveRequestModal, setShowLeaveRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [leaveData, setLeaveData] = useState<Leave[]>([
    {
      id: 1,
      type: "Annual Leave",
      startDate: "Mar 4, 2025",
      endDate: "Mar 13, 2025",
      duration: 10,
      status: "Approved",
    },
    {
      id: 2,
      type: "Sick Leave",
      startDate: "Jan 10, 2025",
      endDate: "Jan 12, 2025",
      duration: 3,
      status: "Approved",
    },
    {
      id: 3,
      type: "Personal Leave",
      startDate: "Dec 5, 2024",
      endDate: "Dec 7, 2024",
      duration: 3,
      status: "Approved",
    },
    {
      id: 4,
      type: "Maternity Leave",
      startDate: "Sep 1, 2024",
      endDate: "Dec 1, 2024",
      duration: 90,
      status: "Approved",
    },
    {
      id: 5,
      type: "Unpaid Leave",
      startDate: "Aug 15, 2024",
      endDate: "Aug 20, 2024",
      duration: 6,
      status: "Rejected",
    },
  ]);

  const leaveTypesInfo: Record<string, LeaveTypeInfo> = {
    "Annual Leave": {
      type: "Annual Leave",
      totalDays: 20,
      usedDays: 15,
      remainingDays: 5,
    },
    "Sick Leave": {
      type: "Sick Leave",
      totalDays: 10,
      usedDays: 3,
      remainingDays: 7,
    },
    "Personal Leave": {
      type: "Personal Leave",
      totalDays: 5,
      usedDays: 3,
      remainingDays: 2,
    },
    "Maternity Leave": {
      type: "Maternity Leave",
      totalDays: 90,
      usedDays: 90,
      remainingDays: 0,
    },
    "Emergency Leave": {
      type: "Emergency Leave",
      totalDays: 3,
      usedDays: 0,
      remainingDays: 3,
    },
  };

  const handleOpenLeaveRequest = () => {
    setShowLeaveRequestModal(true);
  };

  const handleCloseLeaveRequest = () => {
    setShowLeaveRequestModal(false);
  };

  const handleOpenDetails = (leave: Leave) => {
    setSelectedLeave(leave);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
  };

  const handleSubmitLeave = (
    leaveType: string,
    startDate: string,
    endDate: string
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    const newLeave: Leave = {
      id: leaveData.length + 1,
      type: leaveType,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      duration: diffDays,
      status: "Approved", 
    };

    setLeaveData([newLeave, ...leaveData]);
    setShowLeaveRequestModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Calculate summary counts
  const usedLeaves = leaveData.filter(
    (leave) => leave.status === "Approved"
  ).length;
  const pendingLeaves = 0; 
  const rejectedLeaves = leaveData.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  return (
    <div className="container">
      <div className="flex justify-end mb-6">
        <LeaveRequestButton onOpen={handleOpenLeaveRequest} />
      </div>
      <LeaveSummary
        used={usedLeaves}
        pending={pendingLeaves}
        rejected={rejectedLeaves}
      />
      <LeaveHistory leaves={leaveData} onInfoClick={handleOpenDetails} />

      {showLeaveRequestModal && (
        <LeaveRequestModal
          onClose={handleCloseLeaveRequest}
          onSubmit={handleSubmitLeave}
          leaveTypes={Object.keys(leaveTypesInfo)}
        />
      )}

      {showDetailsModal && selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={handleCloseDetails}
          leaveInfo={leaveTypesInfo[selectedLeave.type]}
        />
      )}
    </div>
  );
};

export default Page;
