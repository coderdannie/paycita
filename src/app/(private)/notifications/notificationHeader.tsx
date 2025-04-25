"use client";

import React from "react";
import { Trash2, X } from "lucide-react";

interface NotificationHeaderProps {
  onDeleteSelected: () => void;
  onDeleteAll: () => void;
  onClose: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onDeleteSelected,
  onDeleteAll,
  onClose,
}) => {
  return (
    <div className="px-2 py-2">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Notification</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>


      <div className="flex space-x-3 mb-2">
        <button
          onClick={onDeleteSelected}
          className="flex-1 flex items-center justify-center px-1 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Trash2 size={16} className="mr-2" />
          Delete Notifications
        </button>
        <button
          onClick={onDeleteAll}
          className="flex-1 flex items-center justify-center px-2 py-2.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Trash2 size={16} className="mr-2" />
          Delete All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationHeader;