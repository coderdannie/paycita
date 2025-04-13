import React, { useMemo, useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useChat } from "./chatContext";
import { FaCheck } from "react-icons/fa";
import { useGetSingleChat } from "@/src/api/hooks/chat/useChatQuery";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";

export const ChatMessages = () => {
  const { currentChat } = useChat();
  const { singleChat, isLoading } = useGetSingleChat(
    currentChat?.chat_id || ""
  );

  // Ref for the last message
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const groupedMessages = useMemo(() => {
    if (!singleChat?.messages) return {};

    const groups: Record<string, typeof singleChat.messages> = {};

    singleChat.messages.forEach((message) => {
      const messageDate = new Date(message.created_at);
      let dateKey: string;

      if (isToday(messageDate)) {
        dateKey = "Today";
      } else if (isYesterday(messageDate)) {
        dateKey = "Yesterday";
      } else {
        dateKey = format(messageDate, "MMMM d, yyyy");
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  }, [singleChat]);

  // Scroll to the last message when messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
    }
  }, [singleChat]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!currentChat) return null;

  if (singleChat?.messages?.length === 0) {
    return (
      <div className="flex-grow flex justify-center items-end p-4 text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="text-center text-[#FFFFFF] my-2 sm:my-4">
            <span className="bg-[#344054] px-3 py-[.5rem] rounded-[.8rem] text-xs sm:text-sm">
              {date}
            </span>
          </div>

          {/* Messages */}
          {dayMessages.map(
            (
              message: {
                id: string;
                sender_id: string;
                message: string;
                created_at: string;
              },
              index: number
            ) => (
              <div
                key={message.id}
                ref={
                  index === dayMessages.length - 1 ? lastMessageRef : undefined
                } // Attach ref to the last message
                className={`flex flex-col mb-2 sm:mb-4 ${
                  message.sender_id !== currentChat.user_id
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-xs p-2 sm:p-3 rounded-lg relative ${
                    message.sender_id !== currentChat.user_id
                      ? "bg-[#692E9F] text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.message}

                  {/* Message Status */}
                  {message.sender_id !== currentChat.user_id && (
                    <div className="absolute bottom-1 right-2">
                      <FaCheck className="text-blue-500" size={10} />
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {format(new Date(message.created_at), "p")}
                </span>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};
