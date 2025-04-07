import React, { useState } from "react";
import { ChevronsUpDown, Info, Trash2 } from "lucide-react";
import { LeaveRequestType } from "../types";
import LeaveDetailsModal from "../Modals/EmployeeLeaveDetailsModal";
import ConfirmationModal from "../../../../../components/common/ConfirmationModal";
import { useToast } from "../../../../../context/ToastContext";
import Pagination from "../../Pagination/pagination";


interface LeaveRequestTableProps {
  requests: LeaveRequestType[];
  onStatusUpdate?: (id: number, newStatus: LeaveRequestType["status"]) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const EmployeeLeaveRequestTable: React.FC<LeaveRequestTableProps> = ({
  requests,
  onStatusUpdate,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedRequest, setSelectedRequest] =
    useState<LeaveRequestType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      // Select all rows
      const allIds = new Set(requests.map((request) => request.id));
      setSelectedRows(allIds);
    } else {
      // Deselect all rows
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: number) => {
    const newSelectedRows = new Set(selectedRows);

    if (selectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }

    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === requests.length);
  };

  const handleViewDetails = (request: LeaveRequestType) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = () => {
    if (selectedRequest && onStatusUpdate) {
      onStatusUpdate(selectedRequest.id, "Approved");
      setIsApproveModalOpen(false);
      setIsDetailsModalOpen(false);
      addToast("Leave request approved", "success");
    }
  };

  const handleReject = () => {
    if (selectedRequest && onStatusUpdate) {
      onStatusUpdate(selectedRequest.id, "Rejected");
      setIsRejectModalOpen(false);
      setIsDetailsModalOpen(false);
      addToast("Leave request rejected", "error");
    }
  };

  const handleInitiateApprove = () => {
    setIsApproveModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleInitiateReject = () => {
    setIsRejectModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleDeleteRequest = (id: number) => {
    // Implement delete functionality
    console.log(`Delete request ${id}`);
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                  <ChevronsUpDown className="w-4 h-4 inline-block ml-1" />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                  <ChevronsUpDown className="w-4 h-4 inline-block ml-1" />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                  <ChevronsUpDown className="w-4 h-4 inline-block ml-1" />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Date
                  <ChevronsUpDown className="w-4 h-4 inline-block ml-1" />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration (Days)
                  <ChevronsUpDown className="w-4 h-4 inline-block ml-1" />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                  <ChevronsUpDown className="w-4 h-4 inline-block ml-1" />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedRows.has(request.id)}
                      onChange={() => handleSelectRow(request.id)}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(request.requestDate)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.employeeName}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.leaveType}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.leaveDate}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    {request.duration}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                        request.status === "Pending"
                          ? "border border-[#FFD384] text-[#FFA80A]"
                          : request.status === "Approved"
                          ? "border border-[#89D8A9]  text-[#00AA4F]"
                          : "border border-[#F49E9E] text-[#EA3D3D]"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-600 p-1 rounded-lg border border-gray-200"
                        onClick={() => handleViewDetails(request)}
                        aria-label="View details"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      <button
                        className="text-gray-600 p-1 rounded-lg border border-gray-200"
                        onClick={() => handleDeleteRequest(request.id)}
                        aria-label="Delete request"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <LeaveDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        leaveRequest={selectedRequest}
        onApprove={handleInitiateApprove}
        onReject={handleInitiateReject}
      />

      <ConfirmationModal
        isOpen={isApproveModalOpen}
        onCancel={() => setIsApproveModalOpen(false)}
        onConfirm={handleApprove}
        title="Approve leave request?"
        actionLabel="Confirm"
      />
  
      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        onConfirm={handleReject}
        title="Reject leave request?"
        actionLabel="Reject"
      />
    </>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  // Use UTC methods to ensure consistent formatting
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  const weekday = date.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' });
  
  return `${weekday}, ${day} ${month} ${year}`;
};

export default EmployeeLeaveRequestTable;
