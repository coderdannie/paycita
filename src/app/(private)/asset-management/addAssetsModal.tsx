"use client";

import { useState, useRef, useEffect } from "react";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (asset) => void;
}

export const AddAssetModal = ({
  isOpen,
  onClose,
  onAddAsset,
}: AddAssetModalProps) => {
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState("Laptops");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("In Stock");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAsset({
      name: assetName,
      category,
      quantity: parseInt(quantity),
      status,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAssetName("");
    setCategory("Laptops");
    setQuantity("");
    setStatus("In Stock");
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const selectStatus = (newStatus: string) => {
    setStatus(newStatus);
    setStatusDropdownOpen(false);
  };

  const getStatusStyles = (statusValue: string) => {
    switch (statusValue) {
      case "In Stock":
        return "gren";
      case "Out of Stock":
        return "reid";
      case "On Order":
        return "yello";
      default:
        return "gren";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Asset</h2>
          <button
            onClick={onClose}
            className="text-[#6C6F75] hover:text-gray-600"
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
              htmlFor="assetName"
              className="block text-sm font-medium text-[#1D2939] mb-1"
            >
              Asset Name
            </label>
            <input
              type="text"
              id="assetName"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-[#1D2939] mb-1"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full px-3 py-2 border rounded-md pr-10"
              >
                <option value="Laptops">Laptops</option>
                <option value="Phones">Phones</option>
                <option value="Monitors">Monitors</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
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
              htmlFor="quantity"
              className="block text-sm font-medium text-[#1D2939] mb-1"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-[#1D2939] mb-1"
            >
              Status
            </label>
            <div className="relative" ref={dropdownRef}>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="sr-only"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="On Order">On Order</option>
              </select>

              <div
                className="border rounded-md p-2 flex items-center justify-between cursor-pointer"
                onClick={toggleStatusDropdown}
              >
                <div className={`px-1 py-1 rounded ${getStatusStyles(status)}`}>
                  {status}
                </div>

                <div className="flex items-center px-2">
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

              {statusDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectStatus("In Stock")}
                  >
                    In Stock
                  </div>
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectStatus("Out of Stock")}
                  >
                    Out of Stock
                  </div>
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectStatus("On Order")}
                  >
                    On Order
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#344054] rounded-md text-[#344054] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800"
            >
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
