"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import {
  PusherMessage,
  subscribeToChannel,
} from "../service/api/pusher.service";
import { playReceivedSound, initAudio } from "../utils/audio";

interface NotificationContextType {
  unreadCount: number;
  chatNotifications: Record<string, number>;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  resetChatNotification: (chatId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatNotifications, setChatNotifications] = useState<
    Record<string, number>
  >({});

  // Initialize audio on mount
  useEffect(() => {
    initAudio();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToChannel(
      `chat.${user.id}`,
      "new-message",
      user.id,
      (data: PusherMessage) => {
        console.log("New message received:", data);

        // Only play sound and increment count for messages from others
        if (data.sender_id !== user.id) {
          playReceivedSound();

          // Update chat-specific notifications
          setChatNotifications((prev) => ({
            ...prev,
            [data.chat_id]: (prev[data.chat_id] || 0) + 1,
          }));

          incrementUnreadCount();

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            new Notification("New Message", {
              body: `${data.sender_name || "Someone"}: ${data.message}`,
              icon: "/favicon.ico",
              tag: data.chat_id, // Prevent multiple notifications from same chat
            });
          }
        }
      }
    );

    // Request notification permission on mount
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => unsubscribe();
  }, [user?.id]);

  const incrementUnreadCount = () => {
    setUnreadCount((prev) => prev + 1);
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  const resetChatNotification = (chatId: string) => {
    setChatNotifications((prev) => {
      const newNotifications = { ...prev };
      delete newNotifications[chatId];
      return newNotifications;
    });
    // Decrease unread count by the number of notifications for this chat
    setUnreadCount((prev) =>
      Math.max(0, prev - (chatNotifications[chatId] || 0))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        chatNotifications,
        incrementUnreadCount,
        resetUnreadCount,
        resetChatNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
