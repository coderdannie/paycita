"use client";
// import { Asset, Employee } from "@/types/assets-management";
import { useState } from "react";
import { AssetEmptyState } from "./emptyState";
import { AssetTabs } from "./assetTabs";
// import { Employee } from "@/src/types/dashboard";
import { Asset, Employee } from "@/src/types/assets-management";
import {
  useCreateAsset,
  useGetAllAssets,
} from "@/src/hooks/asset-management/useAssetManagement";

export const AssetManagementDashboard = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees] = useState<Employee[]>([
    { id: "E-001", name: "Sarah Johnson" },
    { id: "E-002", name: "John Doe" },
  ]);

  const { mutate: mutateAddAsset } = useCreateAsset();
  const addAsset = (asset: Omit<Asset, "id">) => {
    // const newAsset: Asset = {
    //   ...asset,
    //   id: `A-${(assets.length + 1001).toString()}`,
    // };
    mutateAddAsset(asset, {
      onSuccess: (data) => {
        console.log("Asset created successfully:", data);
      },
    });
    // setAssets([...assets, newAsset]);
  };

  const assignAsset = (assetId: string, employeeId: string) => {
    setAssets(
      assets.map((asset) => {
        if (asset.id === assetId) {
          const employee = employees.find((emp) => emp.id === employeeId);
          return {
            ...asset,
            assignedTo: employee,
          };
        }
        return asset;
      })
    );
  };

  const { allAssets } = useGetAllAssets({
    page: "1",
  });

  return (
    <div className="max-w-7xl mx-auto">
      {allAssets.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Assets</h1>
          <AssetTabs
            assets={allAssets}
            employees={employees}
            onAddAsset={addAsset}
            onAssignAsset={assignAsset}
          />
        </>
      ) : (
        <AssetEmptyState onAddAsset={addAsset} employees={employees} />
      )}
    </div>
  );
};
