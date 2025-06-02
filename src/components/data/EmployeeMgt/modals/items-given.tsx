import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Types
// interface ItemsGivenData {
//   id_card?: boolean;
//   laptop?: boolean;
//   accommodation?: boolean;
//   phone?: boolean;
// }

interface EditItemsGivenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItems: string[]; // Array of current items given to employee
  onSave: (updatedItems: string[]) => void;
}

// Available items that can be given to employees
const AVAILABLE_ITEMS = [
  { key: "id_card", label: "Id Card" },
  { key: "laptop", label: "Laptop" },
  { key: "accommodation", label: "Accommodation" },
  { key: "phone", label: "Phone" },
];

const EditItemsGivenModal: React.FC<EditItemsGivenModalProps> = ({
  isOpen,
  onClose,
  currentItems = [],
  onSave,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Initialize selected items when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItems([...currentItems]);
    }
  }, [isOpen, currentItems]);

  const handleItemToggle = (itemKey: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemKey)) {
        return prev.filter((item) => item !== itemKey);
      } else {
        return [...prev, itemKey];
      }
    });
  };

  const handleSave = () => {
    onSave(selectedItems);
    onClose();
  };

  const handleCancel = () => {
    setSelectedItems([...currentItems]); // Reset to original state
    onClose();
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal positioned at right - starts from right edge */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <h6 className="text-gray-900 font-semibold text-lg">
            Edit Items given
          </h6>
          <button
            type="button"
            onClick={handleCancel}
            className="hover:bg-gray-100 p-1 rounded-md text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-6">
          <div className="space-y-4">
            {AVAILABLE_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={item.key}
                  checked={selectedItems.includes(item.key)}
                  onChange={() => handleItemToggle(item.key)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={item.key}
                  className="text-gray-700 text-sm font-medium cursor-pointer"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-gray-200 absolute bottom-0 left-0 right-0 bg-white">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 rounded-md border border-[#692E9F] text-[#692E9F] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#692E9F] focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-[#F2F4F7] text-[#98A2B3] rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemsGivenModal;
