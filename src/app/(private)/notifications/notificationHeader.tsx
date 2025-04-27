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
          className="flex-1 lg:px-2 lg:py-1 sm:py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <div className="hidden sm:flex items-center justify-center w-full">
            <Trash2 size={16} className="mr-2 flex-shrink-0" />
            <span>Delete Notifications</span>
          </div>

          <div className="flex sm:hidden items-center justify-center w-full">
            <Trash2 size={16} className="mr-2 flex-shrink-0" />
            <div className="flex flex-col items-start">
              <span>Delete</span>
              <span>Notifications</span>
            </div>
          </div>
        </button>

        <button
          onClick={onDeleteAll}
          className="flex-1 px-2 py-1 sm:py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <div className="hidden sm:flex items-center justify-center w-full">
            <Trash2 size={16} className="mr-2 flex-shrink-0" />
            <span>Delete All Notifications</span>
          </div>

          <div className="flex sm:hidden items-center justify-center w-full">
            <Trash2 size={16} className="mr-2 flex-shrink-0" />
            <div className="flex flex-col items-start">
              <span>Delete All</span>
              <span>Notifications</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NotificationHeader;
