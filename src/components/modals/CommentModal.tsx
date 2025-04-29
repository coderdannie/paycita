// components/CommentModal.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "../ui/button";
import { FaPaperPlane } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { Comments } from "@/src/types/procurement";
import { formatDistanceToNow } from "date-fns";

// Helper function to format date
const formatCommentTime = (dateString: string | undefined): string => {
  if (!dateString) return "";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comments[];
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export default function CommentModal({
  isOpen,
  onClose,
  comments,
  onSend,
  isLoading = false,
}: CommentModalProps) {
  const [input, setInput] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when comments change or modal opens
  useEffect(() => {
    if (isOpen) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, isOpen]);

  const handleSend = useCallback(() => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  }, [input, onSend, isLoading]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Enter" && !event.shiftKey && input.trim()) {
        handleSend();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, input, handleSend]);

  const modalVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex pb-2 justify-between items-center mb-4 border-b border-[#E7E7ED] flex-shrink-0">
              <h2 className="text-lg font-semibold text-[#344054]">
                Comment Thread
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 text-xl p-1 rounded-full hover:bg-gray-100"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            {/* Comments Area */}
            <div className="space-y-4 flex-grow overflow-y-auto pr-2 max-h-[60vh]">
              {comments.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">
                  No comments yet.
                </p>
              )}
              {comments.map((c) => (
                <div key={c.id}>
                  <div className="flex items-center gap-2">
                    {c.user?.profile_picture ? (
                      <Image
                        src={c.user.profile_picture}
                        alt={c.user.name || "User"}
                        width={30}
                        height={30}
                        className="rounded-full w-8 h-8 object-cover"
                      />
                    ) : (
                      <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                        <span className="font-medium text-gray-600 dark:text-gray-300 text-xs">
                          {c.user?.name?.substring(0, 2).toUpperCase() || "SY"}
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-medium text-gray-800">
                      {c.user?.name || "System"}
                      <span className="text-xs text-gray-400 ml-2">
                        {formatCommentTime(c.created_at)}
                      </span>
                    </p>
                  </div>

                  <p className="text-sm text-gray-700 pl-10 mt-1">
                    {c.message}
                  </p>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-4 flex items-center border rounded-md px-3 py-2 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your comment..."
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                className="p-2 ml-2 h-8 w-8"
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <FaPaperPlane className="h-4 w-4" />
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
