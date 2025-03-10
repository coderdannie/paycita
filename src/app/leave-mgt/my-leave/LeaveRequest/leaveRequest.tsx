// LeaveRequest/leaveRequestButton.tsx
"use client";

import React from "react";
import { Plus } from "lucide-react";

interface LeaveRequestButtonProps {
  onOpen: () => void;
}

const LeaveRequestButton: React.FC<LeaveRequestButtonProps> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
    >
      <Plus className="w-5 h-5 mr-2" />
      Leave Request
    </button>
  );
};

export default LeaveRequestButton;
