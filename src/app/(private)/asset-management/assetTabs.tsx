'use client';

import { useState } from 'react';
import { AssetTable } from './assetsTable';
import { AssignedTable } from './assignedTable';
import { AssetDetailModal } from './assetDetailModal';
import { Asset, Employee, AssignedAsset } from '@/src/types/assets-management';
import { Plus, Search, Sliders } from 'lucide-react';
import { AssignAssetModal } from './assignAssetsModal';
import { useAssignAsset } from '@/src/hooks/asset-management/useAssetManagement';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { AddAssetModal } from './addAssetsModal';
import { AssetFormValues } from '@/src/utils/validations';

interface AssetTabsProps {
  assets: Asset[];
  employees: Employee[];
  assignedAssets: AssignedAsset[];
  isPending: boolean;
  handleAddAsset: (formValues: AssetFormValues) => void;
}

export const AssetTabs = ({
  assets,
  employees,
  assignedAssets,
  isPending,
  handleAddAsset,
}: AssetTabsProps) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'assigned'>('assets');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [masterCheckbox, setMasterCheckbox] = useState(false);

  const {
    mutate: assignAsset,
    isPending: isAssigning,
    isSuccess,
  } = useAssignAsset({
    onSuccess: () => {
      toast.success('Asset assigned successfully');
      setIsAssignModalOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    },
  });

  const filteredAssets = assets.filter((asset) => {
    const query = searchQuery.toLowerCase();
    return (
      asset.name.toLowerCase().includes(query) ||
      asset.category.toLowerCase().includes(query) ||
      (asset.status && asset.status.toLowerCase().includes(query))
    );
  });

  const filteredAssignedAssets = assignedAssets.filter((assignedAsset) => {
    const query = searchQuery.toLowerCase();
    return (
      assignedAsset.asset_name?.toLowerCase().includes(query) ||
      assignedAsset.category?.toLowerCase().includes(query) ||
      assignedAsset.assigned_to?.full_name.toLowerCase().includes(query)
    );
  });

  const handleMasterCheckboxChange = (checked: boolean) => {
    setMasterCheckbox(checked);
  };

  // Prevent body scroll when modals are open
  if (typeof document !== 'undefined') {
    if (isAddModalOpen || isAssignModalOpen || isDetailModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
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
          {/* <button className="px-3 py-2 border text-[#692E9F] border-[#692E9F] rounded-md flex items-center gap-2 hover:bg-gray-50 whitespace-nowrap">
            <Sliders className="w-5 h-5 text-[#692E9F]" />
            Filter
          </button> */}
        </div>

        <div className="w-full md:w-auto md:ml-auto">
          {activeTab === 'assets' ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 bg-[#692E9F] text-white rounded-md flex items-center gap-2 hover:bg-purple-800 w-full md:w-auto"
            >
              <Plus className="w-5 h-5" />
              <span className="whitespace-nowrap">Add New Asset</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-3 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 whitespace-nowrap w-full md:w-auto"
            >
              Assign Asset
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b mb-4">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('assets')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assets'
                ? 'border-[#692E9F] text-[#692E9F]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } mr-8`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assigned'
                ? 'border-[#692E9F] text-[#692E9F]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assigned
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'assets' ? (
        <AssetTable
          assets={filteredAssets}
          masterCheckbox={masterCheckbox}
          onMasterCheckboxChange={handleMasterCheckboxChange}
        />
      ) : (
        <AssignedTable
          employees={employees}
          assets={assets}
          assignedAssets={filteredAssignedAssets}
          onInfoClick={(asset: Asset) => {
            setSelectedAsset(asset);
            setIsDetailModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddAssetModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddAsset={handleAddAsset}
          isPending={isPending}
        />
      )}

      {isAssignModalOpen && (
        <AssignAssetModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          assets={assets.filter((asset) => !asset.assignedTo)}
          employees={employees}
          onAssign={(assetId, employeeId) => {
            assignAsset({
              asset_id: assetId,
              user_id: employeeId,
            });
          }}
          isPending={isAssigning}
          isSuccess={isSuccess}
        />
      )}

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
