import React from "react";
import { FiX } from "react-icons/fi";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ProfileData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit User Information</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Edit your information to keep us updated.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">First</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Last</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <button
            onClick={onSave}
            className="w-full bg-purple-700 text-white py-3 rounded-md hover:bg-purple-800 mt-4"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
