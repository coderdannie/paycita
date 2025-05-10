"use client";

import { useState } from "react";
import { AddAssetModal } from "./addAssetsModal";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Employee } from "@/src/types/assets-management";

interface AssetEmptyStateProps {
  onAddAsset: (asset) => void;
  employees: Employee[];
}

export const AssetEmptyState = ({
  onAddAsset,
}: // employees,
AssetEmptyStateProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (typeof document !== "undefined" && isModalOpen) {
    document.body.classList.add("overflow-hidden");
  } else if (typeof document !== "undefined") {
    document.body.classList.remove("overflow-hidden");
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg">
      <div className="mb-4">
        <Image
          src="/assets/assetMgtIcon.png"
          alt="Asset logo"
          width={64}
          height={64}
        />
      </div>
      <h2 className="text-xl font-semibold mb-2">No Assets Registered Yet</h2>
      <p className="text-gray-600 mb-8 text-center px-4">
        Start building your inventory by adding company assets
        <br />
        such as laptops, monitors, office furniture, and more.
      </p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 transition"
      >
        <Plus className="h-5 w-5" />
        <span>Add New Asset</span>
      </button>
      <AddAssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAsset={onAddAsset}
      />
    </div>
  );
};
