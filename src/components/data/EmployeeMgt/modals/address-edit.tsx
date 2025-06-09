import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FormDataType {
  country: string;
  address: string;
  state: string;
  city: string;
  post_code: string;
}

interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: FormDataType) => void;
  initialData?: FormDataType;
  isUpdating: boolean;
}

const AddressEditModal: React.FC<AddressEditModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  isUpdating,
  initialData = {
    country: 'Nigeria',
    address:
      'Adetokumbo Ademola Crescent, Abuja, Federal Capital Territory, Nigeria',
    state: 'Abuja',
    city: 'Abuja',
    post_code: '900001',
  },
}) => {
  const [formData, setFormData] = useState<FormDataType>(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    onUpdate(formData);
  };

  const handleCancel = () => {
    setFormData(initialData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Address
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Primary Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Address
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter primary address"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>

              {/* State/Province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter state or province"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              {/* Post Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Code
                </label>
                <input
                  type="text"
                  value={formData.post_code}
                  onChange={(e) =>
                    handleInputChange('post_code', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post code"
                />
              </div>
            </div>
          </div>

          {/* Footer with buttons */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-[#692E9F] text-[#692E9F] rounded-md hover:bg-purple-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isUpdating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#692E9F] text-white hover:bg-[#5a2585]'
                }`}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddressEditModal;
