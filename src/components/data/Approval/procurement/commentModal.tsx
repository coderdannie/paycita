"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

interface CommentModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export default function CommentModal({
  title,
  onClose,
  onSubmit,
}: CommentModalProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mb-4">
          <textarea
            className="w-full border rounded-md p-3 min-h-32 focus:outline-none focusr:ring-2 focus:ring-[#1D2939]"
            placeholder="Add your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#692E9F] text-white rounded text-sm hover:bg-purple-800 w-full"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
