"use client";
import React from "react";
import NotificationItem from "./notificationItem";
import { AppNotification } from "@/src/types/notifications";



interface NotificationListProps {
  notifications: AppNotification[];
  onToggleSelect: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onToggleSelect,
}) => {
  return (
    <div className="px-4 pb-4 pt-2 overflow-y-auto max-h-[calc(100vh-130px)]">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onToggleSelect={onToggleSelect}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No notifications to display
        </div>
      )}
    </div>
  );
};

export default NotificationList;