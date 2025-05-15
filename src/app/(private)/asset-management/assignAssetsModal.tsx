'use client';

import { Button } from '@/components/ui/button';
import { Asset, Employee } from '@/src/types/assets-management';
import { Spinner } from 'react-activity';
import { useEffect, useState } from 'react';
import Select from 'react-select';

interface AssignAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  employees: Employee[];
  onAssign: (assetId: string, employeeId: string) => void;
  isSuccess: boolean;
  isPending: boolean;
}

export const AssignAssetModal = ({
  isOpen,
  onClose,
  assets,
  employees,
  onAssign,
  isPending,
  isSuccess,
}: AssignAssetModalProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');

  const filteredAssets = selectedCategory
    ? assets.filter((asset) => asset.category === selectedCategory)
    : assets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAsset && selectedEmployee) {
      onAssign(selectedAsset, selectedEmployee);
    }
  };

  const resetForm = () => {
    setSelectedEmployee('');
    setSelectedCategory('');
    setSelectedAsset('');
  };
  useEffect(() => {
    if (isSuccess) {
      resetForm();
    }
  }, [isSuccess]);

  // Prepare options for React Select
  const employeeOptions = employees.map((employee) => ({
    value: employee.id,
    label: employee.name,
  }));

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...Array.from(new Set(assets.map((asset) => asset.category))).map(
      (category) => ({
        value: category,
        label: category,
      })
    ),
  ];

  const assetOptions = filteredAssets.map((asset) => ({
    value: asset.id,
    label: asset.name,
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Assign Asset</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="employee"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Employee Name
            </label>
            <Select
              id="employee"
              options={employeeOptions}
              value={employeeOptions.find(
                (option) => option.value === selectedEmployee
              )}
              onChange={(selectedOption) =>
                setSelectedEmployee(selectedOption?.value || '')
              }
              placeholder="Select Employee"
              isSearchable
              required
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <Select
              id="category"
              options={categoryOptions}
              value={categoryOptions.find(
                (option) => option.value === selectedCategory
              )}
              onChange={(selectedOption) => {
                setSelectedCategory(selectedOption?.value || '');
                setSelectedAsset('');
              }}
              placeholder="Select Category"
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="asset"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Asset Name
            </label>
            <Select
              id="asset"
              options={assetOptions}
              value={assetOptions.find(
                (option) => option.value === selectedAsset
              )}
              onChange={(selectedOption) =>
                setSelectedAsset(selectedOption?.value || '')
              }
              placeholder="Select Asset"
              isSearchable
              required
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="flex justify-center">
            <Button
              disabled={isPending}
              type="submit"
              className="flex-1 px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800"
            >
              {isPending ? <Spinner /> : 'Assign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
