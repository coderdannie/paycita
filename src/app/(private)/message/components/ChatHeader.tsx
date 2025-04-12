import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useChat } from "./chatContext";
import Image from "next/image";

export const ChatHeader = ({ onBackClick }) => {
  const { currentChat } = useChat();

  if (!currentChat) return null;

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
        <Image
          src={currentChat?.profile_picture}
          alt={currentChat?.full_name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <div className="font-semibold">{currentChat.full_name}</div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 ${
                currentChat.isOnline ? "bg-green-500" : "bg-red-500"
              } rounded-full mr-2`}
            ></div>
            <span className="text-sm text-gray-500">
              {currentChat.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
