"use client";
import React from "react";
import { X } from "lucide-react";
import { Asset } from "@/types/assets-management";

interface AssignmentDetailsModalProps {
  onClose: () => void;
  asset: Asset;
}

const AssignmentDetailsModal: React.FC<AssignmentDetailsModalProps> = ({
  onClose,
  asset,
}) => {

  if (typeof document !== "undefined") {
    document.body.classList.add("overflow-hidden");
  }


  React.useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("overflow-hidden");
      }
    };
  }, []);


  if (!asset.assignedTo) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Assigned</h2>
          <button onClick={onClose} className="text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Category</span>
            <span className="font-medium">{asset.category}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Asset Name</span>
            <span className="font-medium">{asset.name}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Assigned To</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {asset.assignedTo.name.charAt(0)}
                </span>
              </div>
              <span className="font-medium">{asset.assignedTo.name}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsModal;
