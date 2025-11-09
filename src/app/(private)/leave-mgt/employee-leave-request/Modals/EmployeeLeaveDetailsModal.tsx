import React, { useEffect } from "react";
import { LeaveRequestType } from "../types";
import { formatDate } from "@/src/utils/helper";
import { FileText, ExternalLink } from "lucide-react";

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: LeaveRequestType | null;
  onApprove?: () => void;
  onReject?: () => void;
}

const EmployeeLeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  isOpen,
  onClose,
  leaveRequest,
  onApprove,
  onReject,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !leaveRequest) return null;

  const handleDocumentClick = () => {
    if (leaveRequest.document) {
      window.open(leaveRequest.document, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 p-6">
        <h2 className="text-xl font-bold mb-4">Leave Details</h2>

        <div className="space-y-4">
          <DetailsRow label="Status">
            {leaveRequest.status.toLowerCase() === "pending" && (
              <StatusBadge color="#FFA80A">Pending</StatusBadge>
            )}
            {leaveRequest.status.toLowerCase() === "approved" && (
              <StatusBadge color="#00AA4F">Approved</StatusBadge>
            )}
            {leaveRequest.status.toLowerCase() === "rejected" && (
              <StatusBadge color="#EA3D3D">Rejected</StatusBadge>
            )}
          </DetailsRow>
          <DetailsRow label="Request Date">
            {formatDate(leaveRequest.requestDate)}
          </DetailsRow>
          <DetailsRow label="Employee Name">
            {leaveRequest.employeeName}
          </DetailsRow>
          <DetailsRow label="Leave Type">{leaveRequest.leaveType}</DetailsRow>
          <DetailsRow label="Leave Date">{leaveRequest.leaveDate}</DetailsRow>
          <DetailsRow label="Duration (Days)">
            {leaveRequest.duration}
          </DetailsRow>

          {/* Message Field */}
          {leaveRequest.message && (
            <div className="pt-2">
              <label className="text-gray-500 text-sm block mb-2">
                Message
              </label>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                {leaveRequest.message}
              </div>
            </div>
          )}

          {/* Document Field */}
          {leaveRequest.document && (
            <div className="pt-2">
              <label className="text-gray-500 text-sm block mb-2">
                Document
              </label>
              <button
                onClick={handleDocumentClick}
                className="w-full flex items-center justify-between bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-purple-700 font-medium">
                    View Document
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-purple-600" />
              </button>
            </div>
          )}

          <DetailsRow label="Comment">
            {leaveRequest.comment || "N/A"}
          </DetailsRow>

          {leaveRequest?.status?.toLowerCase() === "pending" && (
            <DetailsRow label="Pending With">
              <span className="text-orange-500">
                {leaveRequest?.pending_with || "N/A"}
              </span>
            </DetailsRow>
          )}
        </div>

        {leaveRequest.status.toLowerCase() === "pending" ? (
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
        ) : (
          <button
            onClick={onClose}
            className="w-full mt-6 py-2 bg-[#692E9F] text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

const DetailsRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium max-w-60">{children}</span>
  </div>
);

const StatusBadge: React.FC<{ color: string; children: React.ReactNode }> = ({
  color,
  children,
}) => (
  <span className="flex items-center" style={{ color }}>
    <span className="w-2 h-2 rounded-full mr-2" style={{ background: color }} />
    {children}
  </span>
);

export default EmployeeLeaveDetailsModal;
