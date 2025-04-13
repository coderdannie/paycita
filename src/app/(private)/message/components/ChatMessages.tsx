import React, { useMemo, useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useChat } from "./chatContext";

export const ChatMessages = () => {
  const { currentChat, conversations, isLoading } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Get conversations for the current chat
  const currentChatConversations = useMemo(
    () => conversations[currentChat?.chat_id] || [],
    [conversations, currentChat?.chat_id]
  );

  // Group messages by date
  const groupedMessages = useMemo(() => {
    if (!currentChatConversations.length) return {};

    const groups: Record<string, typeof currentChatConversations> = {};

    currentChatConversations.forEach((message) => {
      const messageDate = new Date(message.created_at);
      const dateKey = isToday(messageDate)
        ? "Today"
        : isYesterday(messageDate)
        ? "Yesterday"
        : format(messageDate, "MMMM d, yyyy");

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(message);
    });

    return groups;
  }, [currentChatConversations]);

  // Removed redundant scrolling logic

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatConversations]);

  // If no chat is selected, show a placeholder
  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  // If messages are loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading messages...
      </div>
    );
  }

  // If there are no messages, show a placeholder
  if (!currentChatConversations.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div
      ref={null}
      className="flex-grow overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4"
    >
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="text-center text-[#FFFFFF] my-2 sm:my-4">
            <span className="bg-[#344054] px-3 py-[.5rem] rounded-[.8rem] text-xs sm:text-sm">
              {date}
            </span>
          </div>

          {/* Messages */}
          {dayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col mb-2 sm:mb-4 ${
                message.sender_id === currentChat?.user_id
                  ? "items-start"
                  : "items-end"
              }`}
            >
              <div
                className={`max-w-[75%] sm:max-w-xs p-2 sm:p-3 rounded-lg ${
                  message.sender_id === currentChat?.user_id
                    ? "bg-gray-200 text-black"
                    : "bg-[#692E9F] text-white"
                }`}
              >
                {message.message}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {format(new Date(message.updated_at), "p")}
              </span>
            </div>
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
