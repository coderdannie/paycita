"use client";

import { Asset, Employee } from "@/src/types/assets-management";
// import { Asset, Employee } from "@/types/assets-management";
import { useState } from "react";


interface AssignAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  employees: Employee[];
  onAssign: (assetId: string, employeeId: string) => void;
}

export const AssignAssetModal = ({
  isOpen,
  onClose,
  assets,
  employees,
  onAssign,
}: AssignAssetModalProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");

  const filteredAssets = selectedCategory
    ? assets.filter((asset) => asset.category === selectedCategory)
    : assets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAsset && selectedEmployee) {
      onAssign(selectedAsset, selectedEmployee);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedEmployee("");
    setSelectedCategory("");
    setSelectedAsset("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
            <div className="relative">
              <select
                id="employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="appearance-none w-full px-3 py-2 border rounded-md pr-10"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedAsset("");
                }}
                className="appearance-none w-full px-3 py-2 border rounded-md pr-10"
              >
                <option value="">All Categories</option>
                {Array.from(new Set(assets.map((asset) => asset.category))).map(
                  (category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="asset"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Asset Name
            </label>
            <div className="relative">
              <select
                id="asset"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="appearance-none w-full px-3 py-2 border rounded-md pr-10"
                required
              >
                <option value="">Select Asset</option>
                {filteredAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
