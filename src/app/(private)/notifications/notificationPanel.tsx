"use client";
import React, { useState } from "react";
import { mockNotifications } from "./mockData";
import NotificationHeader from "./notificationHeader";
import NotificationList from "./notificationList";
import { Notification } from "@/src/types/notifications";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialNotifications?: Notification[];
}

const lockScroll = () => {

  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.dataset.scrollY = String(scrollY);
};

const unlockScroll = () => {
  const scrollY = Number(document.body.dataset.scrollY || "0");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  initialNotifications = mockNotifications,
}) => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

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

 
  if (isOpen) {
    lockScroll();
  } else {
    unlockScroll();
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed p-5 right-0 top-0 h-full w-full max-w-md bg-gray-50 shadow-xl z-50 flex flex-col rounded-xl mr-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
      >
        <NotificationHeader
          onDeleteSelected={handleDeleteSelected}
          onDeleteAll={handleDeleteAll}
          onClose={onClose}
        />
        <NotificationList
          notifications={notifications}
          onToggleSelect={handleToggleSelect}
        />
      </div>
    </>
  );
};

export default NotificationsPanel;
