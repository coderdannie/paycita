"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { X, ChevronDown } from "lucide-react";

interface FormDataType {
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
}

interface EmergencyContactEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: FormDataType) => void;
  initialData: FormDataType;
}

// FormInput component
const FormInput: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ label, placeholder, value, onChange, required }) => (
  <div className="flex flex-col space-y-2 mb-6">
    <label className="text-sm font-medium text-[#344054]">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-3 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
      required={required}
    />
  </div>
);

// FormSelect component
const FormSelect: React.FC<{
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}> = ({ label, value, onChange, options, required }) => (
  <div className="flex flex-col space-y-2 mb-6">
    <label className="text-sm font-medium text-[#344054]">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white appearance-none pr-10"
        required={required}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const EmergencyContactEditModal: React.FC<EmergencyContactEditModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  initialData,
}) => {
  const [formData, setFormData] = useState<FormDataType>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(initialData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EAECF0]">
          <h2 className="text-lg font-semibold text-[#101828]">
            Edit Emergency Contact
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[#667085]" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            <FormInput
              label="Name"
              placeholder="Enter emergency contact full name"
              value={formData.emergency_contact_name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange("emergency_contact_name", e.target.value)
              }
              required
            />

            <FormSelect
              label="Relationship"
              value={formData.emergency_contact_relationship}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleInputChange(
                  "emergency_contact_relationship",
                  e.target.value
                )
              }
              options={[
                "Spouse",
                "Parent",
                "Child",
                "Sibling",
                "Friend",
                "Other",
              ]}
              required
            />

            <FormInput
              label="Phone Number"
              placeholder="Enter emergency contact phone number"
              value={formData.emergency_contact_phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange("emergency_contact_phone", e.target.value)
              }
              required
            />
          </div>

          {/* Footer Buttons */}
          <div className="p-6 border-t border-[#EAECF0] bg-white">
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium border  border-[#692E9F] text-[#692E9F] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-[#F2F4F7] text-[#98A2B3]  transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyContactEditModal;
