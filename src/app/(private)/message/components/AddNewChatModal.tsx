import React, { useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useChat } from "./chatContext";
import { User } from "./types";

export const AddNewChatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { users, addNewChat } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddChat = () => {
    if (selectedUser) {
      addNewChat(selectedUser);
      onClose();
      setSelectedUser(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex">
      <div className="w-80 bg-white border-l shadow-lg h-full rounded-lg flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add New Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mt-4 max-h-64 overflow-y-auto flex-grow">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${
                  selectedUser?.id === user.id ? "bg-purple-50" : ""
                }`}
                onClick={() => setSelectedUser(user as User)}
              >
                <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
                <div className="flex-grow">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.department}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 flex justify-between items-center mt-auto">
            <button
              onClick={onClose}
              className="px-8 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Close
            </button>
            <button
              onClick={handleAddChat}
              disabled={!selectedUser}
              className={`px-8 py-2 rounded-md ${
                selectedUser
                  ? "bg-[#692E9F] text-white hover:bg-purple-700"
                  : " text-gray-500 cursor-not-allowed"
              }`}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
