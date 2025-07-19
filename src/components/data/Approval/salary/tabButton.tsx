import React from "react";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`pb-2 px-1 font-medium text-sm transition-all duration-300 ${
        isActive
          ? "text-purple-700 border-b-2 border-purple-700"
          : "text-gray-600 hover:text-purple-600"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default TabButton;
