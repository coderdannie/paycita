import React, { useState } from "react";
import { Asset } from "@/src/types/assets-management";
import TanTable from "@/src/components/common/General/TanTable";
import FilterBtn from "@/src/components/common/General/TanTable/filterBtn";
import ExportBtn from "@/src/components/common/General/TanTable/exportBtn";
import { AddAssetModal } from "./addAssetsModal";
import * as z from "zod";

// Define the asset schema with Zod (matching AddAssetModal schema)
export const assetSchema = z.object({
  name: z.string().min(1, { message: "Asset name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  quantity: z
    .string()
    .min(1, { message: "Quantity is required" }),
  status: z.enum(["In Stock", "Out of Stock", "On Order"], {
    required_error: "Status is required",
  }),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetTableProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  masterCheckbox?: boolean;
  setMasterCheckbox?: (checked: boolean) => void;
  onAssignAsset?: (assetId: string, employeeId: string) => void;
  onMasterCheckboxChange?: (checked: boolean) => void;
}

export const AssetTable = ({ assets, onAddAsset }: AssetTableProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // This function handles the conversion from form values to Asset type
  const handleAddAsset = (formValues: AssetFormValues) => {
    // Convert form values to Asset type with all required properties explicitly set
    const asset: Asset = {
      name: formValues.name,
      category: formValues.category,
      quantity: parseInt(formValues.quantity) || 0,
      status: formValues.status
    };
    onAddAsset(asset);
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: Asset } }) => (
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded border border-[#89D8A9] text-[#00AA4F]">
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "", // Can be an empty string since no direct access to data needed
      cell: () => (
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="py-4">
      {assets.length > 0 ? (
        <TanTable
          showSearch
          columnData={columns}
          data={assets}
          leftComp={<FilterBtn func={() => {}} />}
          rightComp={
            <ExportBtn
              label="Add New Asset"
              func={() => setIsAddModalOpen(true)}
            />
          }
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="text-lg font-semibold">No assets available</p>
          <p className="text-sm">Check back later for asset details.</p>
        </div>
      )}

      {isAddModalOpen && (
        <AddAssetModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddAsset={handleAddAsset}
        />
      )}
    </div>
  );
};

export default AssetTable;
