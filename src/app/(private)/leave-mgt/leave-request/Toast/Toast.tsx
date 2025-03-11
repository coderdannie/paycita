// Toast.tsx
import React, { useEffect } from "react";
import { X } from "lucide-react";

export type ToastType = {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
};

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-gray-800";
      case "error":
        return "bg-gray-800";
      case "warning":
        return "bg-gray-800";
      case "info":
        return "bg-gray-800";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div
      className={`${getBgColor()} text-white bg-[#344054] px-6 py-3 rounded-md shadow-lg flex items-center justify-between transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center">
        <span>{toast.message}</span>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-4 text-white hover:text-gray-300"
      >
        <X size={18} />
      </button>
    </div>
  );
};
