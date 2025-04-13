import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { useDashboard } from "@/src/context/dashboardContext";

export const ChatHeader = ({ onBackClick }) => {
  const { currentChat, onlineUsers } = useDashboard();

  if (!currentChat) return null;

  const isOnline = onlineUsers.has(currentChat.user_id);

  return (
    <div className="bg-white border-b p-4 flex items-center w-full">
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="mr-3 text-gray-600 hover:text-gray-800"
          aria-label="Back to chat list"
        >
          <FaArrowLeft />
        </button>
      )}
      <div className="flex items-center">
        <div className="relative">
          <Image
            src={currentChat?.profile_picture}
            alt={currentChat?.full_name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div
            className={`absolute bottom-0 right-2 w-3 h-3 border-2 border-white rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <div>
          <div className="font-semibold">{currentChat.full_name}</div>
          {/* <div className="flex items-center">
            <span className={`text-sm ${isOnline ? "text-green-500" : "text-gray-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};
