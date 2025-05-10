"use client";

import { useState } from "react";

import { AssignAssetModal } from "./assignAssetsModal";

import { AssetDetailModal } from "./assetDetailModal";
import { Asset } from "@/src/types/assets-management";
import { InfoIcon } from "@/src/assets/Icons";
import TanTable from "@/src/components/common/General/TanTable";
import FilterBtn from "@/src/components/common/General/TanTable/filterBtn";
import ExportBtn from "@/src/components/common/General/TanTable/exportBtn";

// Dummy data for employees and assets (for example purposes)
const employees = [
  { id: "E001", name: "Alice Johnson" },
  { id: "E002", name: "Bob Smith" },
  { id: "E003", name: "Charlie Davis" },
  { id: "E004", name: "Dana White" },
];

const assets: Asset[] = [
  {
    id: "A001",
    name: "Dell Latitude 5420",
    category: "Laptop",
    quantity: 1,
    assignedTo: {
      id: "U001",
      name: "Alice Johnson",
    },
    avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "A002",
    name: "iPhone 14 Pro",
    category: "Mobile Phone",
    quantity: 1,
    assignedTo: {
      id: "U002",
      name: "Bob Smith",
    },
    avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "A003",
    name: "Logitech MX Master 3S",
    category: "Accessory",
    quantity: 1,
    assignedTo: {
      id: "U003",
      name: "Charlie Davis",
    },
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "A004",
    name: "Samsung 27'' Monitor",
    category: "Monitor",
    quantity: 1,
    assignedTo: {
      id: "U004",
      name: "Dana White",
    },
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

export const AssignedTable = () => {
  // const [currentPage, setCurrentPage] = useState(0);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const onAssignAsset = (assetId: string, employeeId: string) => {
    console.log(`Assigned Asset ${assetId} to Employee ${employeeId}`);
  };

  const columns = [
    {
      header: "Asset ID",
      accessorKey: "id",
    },
    {
      header: "Asset Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Assigned To",
      cell: ({
        row,
      }: {
        row: { original: Asset & { avatarUrl?: string } };
      }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.avatarUrl || "https://via.placeholder.com/40"}
            alt={row.original.assignedTo?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{row.original.assignedTo?.name}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: Asset } }) => (
        <button
          onClick={() => {
            setSelectedAsset(row.original);
            setIsDetailModalOpen(true);
          }}
          className="text-indigo-500 hover:underline"
        >
          <InfoIcon />
        </button>
      ),
    },
  ];

  return (
    <div className="py-4">
      <TanTable
        columnData={columns}
        data={assets}
        showSearch
        leftComp={<FilterBtn func={() => {}} />}
        rightComp={
          <ExportBtn
            label="Assign New Asset" // Updated label to reflect correct action
            func={() => setIsAssignModalOpen(true)}
          />
        }
      />

      <AssignAssetModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        assets={assets.filter((asset) => !asset.assignedTo)} // Filter unassigned assets
        employees={employees}
        onAssign={(assetId, employeeId) => {
          onAssignAsset(assetId, employeeId);
          setIsAssignModalOpen(false);
        }}
      />

      <AssetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
};
