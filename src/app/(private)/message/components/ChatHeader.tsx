import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useChat } from "./chatContext";

export const ChatHeader: React.FC = () => {
  const { currentChat } = useChat();

  if (!currentChat) return null;

  return (
    <div className="bg-white border-b p-4 flex items-center w-full">
      <div className="flex items-center">
        <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
        <div>
          <div className="font-semibold">{currentChat.name}</div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
