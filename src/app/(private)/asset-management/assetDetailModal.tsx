"use client";

import { Asset } from "@/src/types/assets-management";
// import { Asset } from "@/types/assets-management";
// import { Asset } from "@/types/assets-management";
import { X } from "lucide-react";

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null; // Allow null as a valid type
}

export const AssetDetailModal = ({
  isOpen,
  onClose,
  asset,
}: AssetDetailModalProps) => {
  if (!isOpen || !asset || !asset.assignedTo) return null;

  if (typeof document !== "undefined" && isOpen) {
    document.body.classList.add("overflow-hidden");
  } else if (typeof document !== "undefined") {
    document.body.classList.remove("overflow-hidden");
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Assigned</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{asset.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Asset Name</p>
            <p className="font-medium">{asset.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <div className="flex items-center mt-1">
              <div className="flex-shrink-0 h-8 w-8">
                <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                  {asset.assignedTo.name.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium">{asset.assignedTo.name}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
