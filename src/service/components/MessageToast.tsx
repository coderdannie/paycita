import React from 'react';

interface MessageToastProps {
  content: string;
  onDismiss: () => void;
  onNavigate: () => void;
}

export const MessageToast: React.FC<MessageToastProps> = ({
  content,
  onDismiss,
  onNavigate,
}) => {
  return (
    <div 
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-lg cursor-pointer"
      onClick={onNavigate}
    >
      <div className="flex-1">
        <p className="text-sm text-gray-800 whitespace-pre-line">{content}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}; 