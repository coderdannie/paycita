import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Edit3, X, XCircle, Loader2 } from 'lucide-react';
import { formatDate } from '@/src/utils/helper';
import { useUpdateQueryStatus } from '@/src/hooks/query-mgt/useQueryMgt';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface Comment {
  id: number;
  query_id: string;
  user_id: {
    id: string;
    full_name: string;
  };
  message: string;
}

interface QueryDetailsData {
  id: number;
  title: string;
  message: string;
  employee: string;
  department: string;
  priority: string;
  date: string;
  status: string;
  comments: Comment[];
}

interface QueryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queryData: QueryDetailsData | null;
  onSendComment?: (comment: string) => void;
  isPendingSendComment?: boolean;
}

const QueryDetailsDrawer: React.FC<QueryDetailsDrawerProps> = ({
  isOpen,
  onClose,
  queryData,
  onSendComment,
  isPendingSendComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const { mutate: mutateUpdateStatus, isPending: isUpdating } =
    useUpdateQueryStatus();

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  const renderPriorityBadge = useCallback((priority: string) => {
    const getPriorityStyles = (priority: string) => {
      switch (priority.toLowerCase()) {
        case 'high':
          return 'text-[#00AA4F] border-[#00AA4F] bg-[#F0F9F4]';
        case 'medium':
          return 'text-[#FFA80A] border-[#FFD384] bg-[#FFF8E7]';
        case 'low':
          return 'text-[#6C757D] border-[#6C757D] bg-[#F8F9FA]';
        default:
          return 'text-[#6C757D] border-[#6C757D] bg-[#F8F9FA]';
      }
    };

    return (
      <span
        className={`py-1 px-3 text-xs border rounded-md capitalize font-medium ${getPriorityStyles(
          priority
        )}`}
      >
        {priority}
      </span>
    );
  }, []);

  const renderStatusBadge = useCallback((status: string) => {
    const getStatusStyles = (status: string) => {
      switch (status.toLowerCase()) {
        case 'open':
          return 'text-[#0066CC] border-[#0066CC] bg-[#E6F3FF]';
        case 'resolved':
          return 'text-[#00AA4F] border-[#00AA4F] bg-[#F0F9F4]';
        case 'in_progress':
          return 'text-[#FFA80A] border-[#FFD384] bg-[#FFF8E7]';
        default:
          return 'text-[#6C757D] border-[#6C757D] bg-[#F8F9FA]';
      }
    };

    return (
      <span
        className={`py-1 px-3 text-xs border rounded-md capitalize font-medium ${getStatusStyles(
          status
        )}`}
      >
        {status.replace('_', ' ')}
      </span>
    );
  }, []);

  const handleEditStatus = () => {
    setSelectedStatus(queryData?.status || '');
    setIsEditingStatus(true);
  };

  const handleSaveStatus = () => {
    if (queryData && selectedStatus !== queryData.status) {
      const updatePayload = {
        data: { status: selectedStatus },
        id: queryData.id.toString(),
      };
      mutateUpdateStatus(updatePayload, {
        onSuccess: (res) => {
          toast.success(res.data.message || 'Status updated successfully');
          setIsEditingStatus(false); // Close editing mode on success
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.message || 'Failed to update status';
            toast.error(errorMessage);
          } else {
            toast.error('An unexpected error occurred during update.');
          }
          // Don't close editing mode on error, so user can try again
        },
      });
    } else {
      // If no changes, just close editing mode
      setIsEditingStatus(false);
    }
  };

  const handleCancelStatusEdit = () => {
    setSelectedStatus('');
    setIsEditingStatus(false);
  };

  const handleSendComment = () => {
    if (newComment.trim() && !isPendingSendComment) {
      // Call the parent handler if provided
      if (onSendComment) {
        onSendComment(newComment.trim());
      }

      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  if (!queryData) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50  z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[600px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Query Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Query Details Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Query Title:
                  </label>
                  <p className="text-sm text-gray-900">{queryData.title}</p>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Description:
                  </label>
                  <p className="text-sm text-gray-900">{queryData.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Assigned To:
                  </label>
                  <p className="text-sm text-gray-900">{queryData.employee}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Department:
                  </label>
                  <p className="text-sm text-gray-900">
                    {queryData.department}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Priority:
                  </label>
                  <div className="mt-1">
                    {renderPriorityBadge(queryData.priority)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Status:
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    {isEditingStatus ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          disabled={isUpdating}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleSaveStatus}
                          disabled={isUpdating}
                          className="p-1 text-green-600 hover:text-green-700 disabled:text-gray-400"
                          title={isUpdating ? 'Updating...' : 'Save changes'}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={handleCancelStatusEdit}
                          disabled={isUpdating}
                          className="p-1 text-red-600 hover:text-red-700 disabled:text-gray-400"
                          title="Cancel"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {renderStatusBadge(queryData.status)}
                        {queryData.status.toLowerCase() !== 'resolved' && (
                          <button
                            onClick={handleEditStatus}
                            className="p-1 text-gray-500 hover:text-gray-700"
                            title="Edit status"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date Created:
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(queryData.date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment Thread Section */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Comment Thread
              </h3>

              {/* Comments List */}
              <div className="space-y-6 mb-6">
                {queryData.comments && queryData.comments.length > 0 ? (
                  queryData.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-3"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-medium text-sm">
                          {comment.user_id.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {comment.user_id.full_name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 block mb-2">
                          just now
                        </span>
                        <p className="text-sm text-gray-700">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comment Input - Fixed at bottom */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a comment......"
                  className="w-full min-h-[60px] max-h-[120px] px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={2}
                />
              </div>
              <Button
                onClick={handleSendComment}
                disabled={!newComment.trim() || isPendingSendComment}
                className="px-4 py-2 text-sm font-medium rounded-lg"
              >
                {isPendingSendComment ? 'Sending...' : 'Send Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QueryDetailsDrawer;
