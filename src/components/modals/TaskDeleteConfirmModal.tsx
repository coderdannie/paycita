"use client";
import React from 'react';

interface TaskDeleteConfirmModalProps {
  isOpen: boolean;
  taskTitle?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const TaskDeleteConfirmModal: React.FC<TaskDeleteConfirmModalProps> = ({ isOpen, taskTitle, loading, onCancel, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete{` `}
          <span className="font-medium text-gray-900">{taskTitle || 'this task'}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDeleteConfirmModal;
