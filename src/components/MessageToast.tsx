import React from 'react';

interface MessageToastProps {
  content: string;
  onDismiss: () => void;
  onNavigate: () => void;
}

export const MessageToast: React.FC<MessageToastProps> = ({ content, onDismiss, onNavigate }) => {
  return (
    <button
      onClick={() => {
        onDismiss();
        onNavigate();
      }}
      className="w-full text-left hover:underline"
    >
      {content}
    </button>
  );
}; 