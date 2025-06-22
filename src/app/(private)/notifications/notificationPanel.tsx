"use client";
import React, { useState, useEffect, useRef } from "react";

import NotificationHeader from "./notificationHeader";
import NotificationList from "./notificationList";
import { AppNotification } from "@/src/types/notifications";
import { useGetAppNotifications, useDeleteAppNotification, useDeleteAllAppNotifications } from "@/src/hooks/app-notifications/useAppNotifications";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const lockScroll = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.dataset.scrollY = String(scrollY);
};

const unlockScroll = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const scrollY = Number(document.body.dataset.scrollY || "0");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { appNotifications, isLoading, isError } = useGetAppNotifications();
  const { mutate: deleteNotification } = useDeleteAppNotification();
  const { mutate: deleteAllNotifications } = useDeleteAllAppNotifications();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const prevAppNotificationsRef = useRef<AppNotification[] | undefined>(undefined); // Initialize useRef with undefined

  useEffect(() => {
    const hasDataChanged = JSON.stringify(appNotifications) !== JSON.stringify(prevAppNotificationsRef.current);

    if (appNotifications && hasDataChanged) {
      setSelectedIds(new Set());
      setNotifications(appNotifications.map(n => ({ ...n, isSelected: false })));
      prevAppNotificationsRef.current = appNotifications;
    } else if (!appNotifications && prevAppNotificationsRef.current) {
      setSelectedIds(new Set());
      setNotifications([]);
      prevAppNotificationsRef.current = undefined;
    }
  }, [appNotifications]);

  const handleToggleSelect = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    const notificationIndex = notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) return;

    const isCurrentlySelected = newSelectedIds.has(id);

    if (isCurrentlySelected) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }

    setSelectedIds(newSelectedIds);

    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isSelected: !isCurrentlySelected }
          : notification
      )
    );
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach(id => {
      deleteNotification(id);
    });
  };

  const handleDeleteAll = () => {
    deleteAllNotifications();
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
        className="fixed p-5 right-0 top-0 h-full w-full max-w-md bg-gray-50 shadow-xl z-50 flex flex-col rounded-xl lg:mr-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
      >
        <NotificationHeader
          onDeleteSelected={handleDeleteSelected}
          onDeleteAll={handleDeleteAll}
          onClose={onClose}
          isDeleteSelectedDisabled={selectedIds.size === 0}
          isDeleteAllDisabled={notifications.length === 0 || isLoading}
        />
        {isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-red-600">
            Failed to load notifications.
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            onToggleSelect={handleToggleSelect}
          />
        )}
      </div>
    </>
  );
};

export default NotificationsPanel;
