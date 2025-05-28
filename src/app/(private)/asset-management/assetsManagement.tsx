'use client';

import { useEffect, useState } from 'react';
import { AssetEmptyState } from './emptyState';
import { AssetTabs } from './assetTabs';
import { Asset, Employee } from '@/src/types/assets-management';
import {
  useCreateAsset,
  useGetAllAssets,
  useGetAllAssignedAssets,
  useGetAllUsers,
} from '@/src/hooks/asset-management/useAssetManagement';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { AssetFormValues } from '@/src/utils/validations';

export const AssetManagementDashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { users } = useGetAllUsers();

  useEffect(() => {
    if (users && users.length > 0) {
      setEmployees(
        users?.map((user) => ({
          id: user?.id,
          name: user?.full_name,
        }))
      );
    }
  }, [users]);
  const { mutate: createAsset, isPending } = useCreateAsset({
    onSuccess: () => {
      toast.success('Asset created successfully');
      setIsAddModalOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    },
  });

  const handleAddAsset = (formValues: AssetFormValues) => {
    const asset: Asset = {
      name: formValues.name,
      category: formValues.category,
      quantity: parseInt(formValues.quantity) || 0,
      status: formValues.status,
    };
    createAsset(asset);
  };
  const { allAssets } = useGetAllAssets({
    page: '1',
  });

  const { assignedAssets } = useGetAllAssignedAssets({
    page: '1',
  });

  return (
    <div className="max-w-7xl mx-auto">
      {allAssets?.length ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Assets</h1>
          <AssetTabs
            assets={allAssets}
            employees={employees}
            assignedAssets={assignedAssets}
            isPending={isPending}
            handleAddAsset={handleAddAsset}
          />
        </>
      ) : (
        <AssetEmptyState
          handleAddAsset={handleAddAsset}
          isPending={isPending}
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      )}
    </div>
  );
};
