import React, { useMemo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useChat } from "./chatContext";
import { FaCheck } from "react-icons/fa";

export const ChatMessages = () => {
  const { currentChat, conversations } = useChat();

  const groupedMessages = useMemo(() => {
    if (!currentChat) return {};

    const messages = conversations[currentChat.id] || [];
    const groups: Record<string, typeof messages> = {};

    messages.forEach((message) => {
      const messageDate = message.timestamp;
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
  }, [conversations, currentChat]);

  if (!currentChat) return null;

  return (
    <div className="flex-grow overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <div key={date}>
          <div className="text-center text-[#FFFFFF] my-2 sm:my-4">
            <span className="bg-[#344054] px-3 py-[.5rem] rounded-[.8rem] text-xs sm:text-sm">
              {date}
            </span>
          </div>
          {dayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col mb-2 sm:mb-4 ${
                message.type === "sent" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`
                  max-w-[75%] sm:max-w-xs p-2 sm:p-3 rounded-lg relative
                  ${
                    message.type === "sent"
                      ? "bg-[#692E9F] text-white"
                      : "bg-gray-200 text-black"
                  }
                `}
              >
                {message.content}

                {message.type === "sent" && (
                  <div className="absolute bottom-1 right-2">
                    {message.status === "sent" && !currentChat.isOnline && (
                      <FaCheck className="text-blue-500" size={10} />
                    )}
                    {(message.status === "delivered" ||
                      (message.status === "sent" && currentChat.isOnline)) && (
                      <div className="flex">
                        <FaCheck className="text-gray-400" size={10} />
                        <FaCheck className="text-gray-400 -ml-1" size={10} />
                      </div>
                    )}
                    {message.status === "read" && (
                      <div className="flex">
                        <FaCheck className="text-blue-500" size={10} />
                        <FaCheck className="text-blue-500 -ml-1" size={10} />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {isToday(message.timestamp)
                  ? `Today ${format(message.timestamp, "HH:mm")}`
                  : format(message.timestamp, "p")}
              </span>
            </div>
          ))}
        </div>
      ))}{" "}
    </div>
  );
};
