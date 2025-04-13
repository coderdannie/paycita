import React, { useState, useEffect } from "react";
import { useChat, User } from "./chatContext";
import { FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { AddNewChatModal } from "./AddNewChatModal";
import { MessageIcon } from "@/src/assets/Icons";
import Image from "next/image";
import { useGetAllChat } from "@/src/api/hooks/chat/useChatQuery";
import { formatTimeAgo } from "@/src/utils/helper";

export const ChatSidebar = ({ onChatSelect }) => {
  const { allChats } = useGetAllChat();

  const transformedChats = allChats.map(
    (chat: {
      chat_id: string;
      user_id: {
        id: string;
        full_name: string;
        email: string;
        profile_picture: string;
      };
      created_at: string;
    }) => ({
      chat_id: chat?.chat_id,
      user_id: chat?.user_id?.id,
      full_name: chat?.user_id?.full_name,
      email: chat?.user_id?.email,
      profile_picture: chat?.user_id?.profile_picture,
      created_at: chat?.created_at,
    })
  );

  const { currentChat, selectChat, conversations } = useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load the persisted chat from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      const parsedChat = JSON.parse(savedChat);
      selectChat(parsedChat);
    }
  }, [selectChat]);

  // Save the selected chat to localStorage whenever it changes
  useEffect(() => {
    if (currentChat) {
      localStorage.setItem("selectedChat", JSON.stringify(currentChat));
    }
  }, [currentChat]);

  const filteredChatUsers = transformedChats?.filter(
    (user: { full_name: string }) =>
      user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatSelect = (user: User) => {
    if (currentChat?.chat_id !== user.chat_id) {
      selectChat(user);
      if (onChatSelect) onChatSelect();
    }
  };

  if (transformedChats?.length === 0) {
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

      <div className="flex-grow overflow-y-auto">
        {filteredChatUsers.map((user: User) => {
          // Get the last message for this user
          const lastMessage =
            conversations[user.chat_id] &&
            conversations[user.chat_id].length > 0
              ? conversations[user.chat_id][
                  conversations[user.chat_id].length - 1
                ]
              : null;

          const isSelected = currentChat?.chat_id === user.chat_id;

          return (
            <div
              key={user.chat_id}
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
                {user.profile_picture ? (
                  <Image
                    width={40}
                    height={40}
                    src={user.profile_picture}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                    <FaUser className="text-gray-500" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <div
                  className={`font-medium ${isSelected ? "text-white" : ""}`}
                >
                  {user.full_name}
                </div>
                <div
                  className={`text-sm truncate ${
                    isSelected ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {lastMessage
                    ? lastMessage.message.length > 30
                      ? lastMessage.message.substring(0, 30) + "..."
                      : lastMessage.message
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
                    {formatTimeAgo(lastMessage.updated_at)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddNewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
