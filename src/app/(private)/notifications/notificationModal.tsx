import { Notification } from "@/types/notifications";
import React, { useState } from "react";
import NotificationList from "./notificationList";
import NotificationHeader from "./notificationHeader";




interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome Aboard",
      message:
        "Welcome to PayCita by Bizshift! Your account has been successfully set up.",
      read: false,
      isSelected: false,
    },
    {
      id: "2",
      title: "Profile Updated",
      message: "Your profile has been updated.",
      read: false,
      isSelected: false,
    },
    {
      id: "3",
      title: "New Message",
      message: "You have a new message from",
      timestamp: "2 minute ago",
      read: false,
      user: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40",
      },
      isSelected: false,
    },
    {
      id: "4",
      title: "Appraisal Started",
      message:
        "Your appraisal for Q2 has started. Please complete it before May 5, 2025",
      read: false,
      isSelected: false,
    },
    {
      id: "5",
      title: "Loan Request Submitted",
      message: "Your loan request of ₦150,000 has been submitted.",
      read: false,
      isSelected: false,
    },
    {
      id: "6",
      title: "System Downtime Notice",
      message: "System update scheduled for Sunday, 11:00 PM - 2:00 AM",
      read: false,
      isSelected: false,
    },
  ]);

  const handleToggleSelect = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isSelected: !notification.isSelected }
          : notification
      )
    );
  };

  const handleDeleteSelected = () => {
    setNotifications(
      notifications.filter((notification) => !notification.isSelected)
    );
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-50 shadow-xl z-50 flex flex-col">
        <NotificationHeader
          onClose={onClose}
          onDeleteSelected={handleDeleteSelected}
          onDeleteAll={handleDeleteAll}
        />
        <NotificationList
          notifications={notifications}
          onToggleSelect={handleToggleSelect}
        />
      </div>
    </>
  );
};

export default NotificationModal;
