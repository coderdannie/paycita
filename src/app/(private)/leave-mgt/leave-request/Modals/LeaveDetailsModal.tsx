import React from "react";
import { LeaveRequestType } from "../types";

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: LeaveRequestType | null;
  onApprove?: () => void;
  onReject?: () => void;
}

const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  isOpen,
  onClose,
  leaveRequest,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !leaveRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Leave Details</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <div className="flex items-center">
                {leaveRequest.status === "Pending" && (
                  <span className="text-[#FFA80A] flex items-center">
                    <span className="w-2 h-2 bg-[#FFA80A] rounded-full mr-2"></span>
                    Pending
                  </span>
                )}
                {leaveRequest.status === "Approved" && (
                  <span className="text-[#00AA4F] flex items-center">
                    <span className="w-2 h-2 bg-[#00AA4F] rounded-full mr-2"></span>
                    Approved
                  </span>
                )}
                {leaveRequest.status === "Rejected" && (
                  <span className="text-[#EA3D3D] flex items-center">
                    <span className="w-2 h-2 bg-[#EA3D3D] rounded-full mr-2"></span>
                    Rejected
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Request Date</span>
              <span className="font-medium">
                {formatDate(leaveRequest.requestDate)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Employee Name</span>
              <span className="font-medium">{leaveRequest.employeeName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Leave Type</span>
              <span className="font-medium">{leaveRequest.leaveType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Leave Date</span>
              <span className="font-medium">{leaveRequest.leaveDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Duration (Days)</span>
              <span className="font-medium">{leaveRequest.duration}</span>
            </div>
          </div>

          {leaveRequest.status === "Pending" && (
            <div className="flex space-x-4 mt-6">
              <button
                onClick={onReject}
                className="flex-1 py-2 border border-[#692E9F] text-[#692E9F] rounded-lg hover:bg-purple-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={onApprove}
                className="flex-1 py-2 bg-[#692E9F] text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Approve
              </button>
            </div>
          )}

          {leaveRequest.status !== "Pending" && (
            <button
              onClick={onClose}
              className="w-full mt-6 py-2 bg-[#692E9F] text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default LeaveDetailsModal;
