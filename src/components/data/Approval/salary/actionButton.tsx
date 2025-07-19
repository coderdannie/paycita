import React from "react";

interface ActionButtonProps {
  label: string;
  variant: "primary" | "secondary" | "reject";
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  variant,
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    "py-2 px-4 rounded text-sm font-medium transition-colors duration-200";

  const variantClasses = {
    primary: "bg-[#692E9F] text-white hover:bg-purple-800",
    secondary: "bg-[#692E9F] text-white hover:bg-purple-800",
    reject: "bg-white text-[#970404] border border-[#CB0606] hover:bg-red-50",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default ActionButton;
