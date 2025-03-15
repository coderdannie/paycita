"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

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
  totalDays?: number;
  usedDays?: number;
  remainingDays?: number;
}

interface LeaveDetailsModalProps {
  leave: Leave;
  leaveInfo?: LeaveTypeInfo;
  onClose: () => void;
}

const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  leave,
  leaveInfo,
  onClose,
}) => {
  useEffect(() => {

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col h-[96%] my-4 mx-4 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Leave Management Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4 flex-grow overflow-y-auto">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Leave Type</span>
            <span className="font-medium">{leave.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Total Leave Days</span>
            <span className="font-medium">
              {leaveInfo?.totalDays ?? 0} Days
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Used Leave Days</span>
            <span className="font-medium">{leaveInfo?.usedDays ?? 0} Days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Remaining Days</span>
            <span className="font-medium">
              {leaveInfo?.remainingDays ?? 0} Days
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Approval Status</span>
            <span
              className={`font-medium px-2 py-1 text-xs rounded ${
                leave.status === "Approved"
                  ? "border border-[#89D8A9] text-[#00AA4F] bg-[#89D8A9]/10"
                  : "border border-[#F49E9E] text-[#EA3D3D] bg-[#F49E9E]/10"
              }`}
            >
              {leave.status}
            </span>
          </div>
        </div>
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailsModal;
