import React from "react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  actionLabel: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  actionLabel,
}) => {
  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // Use createPortal to mount the modal directly to the document body
  // This completely separates it from your component tree, preventing layout shifts
  return createPortal(
    <div
      className="fixed inset-0 z-50"
      style={{
        isolation: "isolate", // Creates a new stacking context for better z-index handling
      }}
    >
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        style={{
          zIndex: 51,
          maxHeight: "calc(100vh - 2rem)",
          overflowY: "auto",
        }}
      >
        <div className="p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#692E9F] rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-extrabold text-3xl">?</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 text-center mb-6">
            Once approved, the employee will be notified.
            <br />
            This action cannot be undone.
          </p>
          <div className="flex space-x-4 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-[#692E9F] text-[#692E9F] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-[#692E9F] text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
