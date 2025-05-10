"use client";

// import { Asset, Employee } from "@/types/assets-management";
import { useState } from "react";
import { AssetTable } from "./assetsTable";
import { AssignedTable } from "./assignedTable";
// import { AddAssetModal } from "./addAssetsModal";
// import { AssignAssetModal } from "./assignAssetsModal";
import { AssetDetailModal } from "./assetDetailModal";
import { Asset, Employee } from "@/src/types/assets-management";


interface AssetTabsProps {
  assets: Asset[];
  employees: Employee[];
  onAddAsset: (asset) => void;
  onAssignAsset: (assetId: string, employeeId: string) => void;
}

export const AssetTabs = ({
  assets,
  // employees,
  onAddAsset,
  // onAssignAsset,
}: AssetTabsProps) => {
  const [activeTab, setActiveTab] = useState("assets");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [masterCheckbox, setMasterCheckbox] = useState(false);

  const assignedAssets = assets.filter((asset) => asset.assignedTo);


  const filteredAssets =
    activeTab === "assets"
      ? assets.filter(
          (asset) =>
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.status?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : assignedAssets.filter(
          (asset) =>
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.assignedTo?.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

  const handleMasterCheckboxChange = (checked: boolean) => {
    setMasterCheckbox(checked);
  };


  if (
    typeof document !== "undefined" &&
    (isAddModalOpen || isAssignModalOpen || isDetailModalOpen)
  ) {
    document.body.classList.add("overflow-hidden");
  } else if (typeof document !== "undefined") {
    document.body.classList.remove("overflow-hidden");
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <button className="px-3 py-2 border text-[#692E9F] border-[#692E9F] rounded-md flex items-center gap-2 hover:bg-gray-50 whitespace-nowrap">
            <Sliders className="w-5 h-5 text-[#692E9F]" />
            Filter
          </button>
        </div> */}
{/* 
        <div className="w-full md:w-auto md:ml-auto">
          {activeTab === "assets" ? (
            // <button
            //   onClick={() => setIsAddModalOpen(true)}
            //   className="px-3 py-2 bg-[#692E9F] text-white rounded-md flex items-center gap-2 hover:bg-purple-800 w-full md:w-auto"
            // >
            //   <Plus className="w-5 h-5" />
            //   <span className="whitespace-nowrap">Add New Asset</span>
            // </button>
            <div>
        </div>
          ) : (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-3 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 whitespace-nowrap w-full md:w-auto"
            >
              Assign Asset
            </button>
          )}
        </div> */}
      </div>

      <div className="border-b mb-4">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("assets")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assets"
                ? "border-[#692E9F] text-[#692E9F]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } mr-8`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab("assigned")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assigned"
                ? "border-[#692E9F] text-[#692E9F]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Assigned
          </button>
        </nav>
      </div>

      {activeTab === "assets" ? (
        <AssetTable
          onAddAsset={onAddAsset}
          assets={filteredAssets}
          masterCheckbox={masterCheckbox}
          onMasterCheckboxChange={handleMasterCheckboxChange}
        />
      ) : (
        <AssignedTable
          // assets={filteredAssets}
          // masterCheckbox={masterCheckbox}
          // onMasterCheckboxChange={handleMasterCheckboxChange}
          // onInfoClick={(asset:any) => {
          //   setSelectedAsset(asset);
          //   setIsDetailModalOpen(true);
          // }}
        />
      )}

      {/* {isAddModalOpen && (
        <AddAssetModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddAsset={onAddAsset}
        />
      )} */}

      {/* {isAssignModalOpen && (
        <AssignAssetModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          assets={assets.filter((asset) => !asset.assignedTo)}
          employees={employees}
          onAssign={(assetId, employeeId) => {
            onAssignAsset(assetId, employeeId);
            setIsAssignModalOpen(false);
          }}
        />
      )} */}

      {selectedAsset && (
        <AssetDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          asset={selectedAsset}
        />
      )}
    </div>
  );
};
