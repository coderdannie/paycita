"use client";

import React from "react";
import { Clock, Repeat } from "lucide-react";
import { Notification } from "@/types/notifications";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


interface NotificationItemProps {
  notification: Notification;
  onToggleSelect: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onToggleSelect,
}) => {
  return (
    <div className="flex items-start space-x-3 mb-3">
      <div className="pt-5">
        <input
          type="checkbox"
          checked={notification.isSelected}
          onChange={() => onToggleSelect(notification.id)}
          className="h-5 w-5 rounded border-gray-300 text-indigo-600"
        />
      </div>
      <div className="flex-1 bg-white rounded-lg p-3 shadow-sm relative border border-gray-100">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base text-gray-900">
            {notification.title}
          </h3>
          <div className="h-2 w-2 rounded-full bg-[#0CC500]"></div>
        </div>

        {notification.user ? (
          <div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <div className="flex items-center mt-2">
              {notification.user.avatar ? (
                <img
                  src={notification.user.avatar}
                  alt={notification.user.name}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                  {notification.user.name.charAt(0)}
                </div>
              )}
              <span className="ml-2 text-sm text-gray-600">
                {notification.user.name}
              </span>
              <div className="ml-auto flex items-center text-xs text-gray-500">
                <span>{notification.timestamp}</span>
              </div>
            </div>
            {notification.id === "3" && (
              <Link href='#' className="absolute bottom-[.2rem] right-3 border rounded p-[.05rem] ">
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Link>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;