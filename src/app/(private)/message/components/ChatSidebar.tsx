import React, { useState } from "react";
import { useChat, User } from "./chatContext";
import { FaPlus, FaSearch, FaCheck } from "react-icons/fa";
import { AddNewChatModal } from "./AddNewChatModal";
import { MessageIcon } from "@/src/assets/Icons";

export const ChatSidebar = ({ onChatSelect }) => {
  const { chatList, currentChat, selectChat, isInitialState, conversations } =
    useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChatUsers = chatList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatSelect = (user: User) => {
    selectChat(user);
    if (onChatSelect) onChatSelect(); 
  };

  if (isInitialState && chatList.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <div className="mx-auto flex justify-center mb-4">
            <div>
              <MessageIcon fill="#344054" className="w-[35px] h-[35px]" />
            </div>
          </div>

          <div className="text-[#171717] font-semibold text-lg">
            No Messages Yet
          </div>
          <div className="text-sm text-gray-500 max-w-xs mx-auto">
            Connect with your colleagues, share ideas, and collaborate
            seamlessly
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#692E9F] text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center mx-auto mt-4"
          >
            <span className="mr-2">+</span> Start a conversation
          </button>
        </div>
        <AddNewChatModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chats</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1"
        >
          <FaPlus />
          <h2>Add New</h2>
        </button>
      </div>

      {!isModalOpen && (
        <div className="p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
        </div>
      )}

      <AddNewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex-grow overflow-y-auto">
        {filteredChatUsers.map((user) => {
          // Get the last message for this user
          const lastMessage =
            conversations[user.id] && conversations[user.id].length > 0
              ? conversations[user.id][conversations[user.id].length - 1]
              : null;

          const isSelected = currentChat?.id === user.id;

          return (
            <div
              key={user.id}
              onClick={() => handleChatSelect(user)}
              className={`flex items-center rounded-lg p-4 cursor-pointer mb-1 mx-2 ${
                isSelected ? "bg-[#692E9F] text-white" : "hover:bg-gray-100"
              }`}
            >
              {isSelected && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#692E9F]"></div>
              )}

              {/* User avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex-shrink-0">
                {/* Avatar content */}
              </div>

              <div className="flex-grow">
                <div
                  className={`font-medium ${isSelected ? "text-white" : ""}`}
                >
                  {user.name}
                </div>
                <div
                  className={`text-sm truncate ${
                    isSelected ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {lastMessage
                    ? lastMessage.content.length > 30
                      ? lastMessage.content.substring(0, 30) + "..."
                      : lastMessage.content
                    : "No messages yet"}
                </div>
              </div>
              <div className="flex flex-col items-end">
                {lastMessage && (
                  <span
                    className={`text-xs mb-1 ${
                      isSelected ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(lastMessage.timestamp).getTime()) /
                        60000
                    )}{" "}
                    m Ago
                  </span>
                )}

                {lastMessage && lastMessage.type === "sent" && (
                  <div className="flex justify-end">
                    {lastMessage.status === "sent" && !user.isOnline && (
                      <FaCheck className="text-blue-500" size={14} />
                    )}
                    {(lastMessage.status === "delivered" ||
                      (lastMessage.status === "sent" && user.isOnline)) && (
                      <div className="flex">
                        <FaCheck className="text-gray-400" size={14} />
                        <FaCheck className="text-gray-400 -ml-1" size={14} />
                      </div>
                    )}
                    {lastMessage.status === "read" && (
                      <div className="flex">
                        <FaCheck className="text-blue-500" size={14} />
                        <FaCheck className="text-blue-500 -ml-1" size={14} />
                      </div>
                    )}
                  </div>
                )}

                {!isSelected && (
                  <div className="mt-1">
                    {user.isOnline ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};