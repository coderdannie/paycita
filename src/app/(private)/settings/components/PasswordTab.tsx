import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import PasswordResetModal from "./modals/PasswordResetModal";


const PasswordTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-1">
            Change Password
          </h2>
          <p className="text-gray-500 text-sm">
            Manage and update your account password
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 flex items-center"
        >
          <FiEdit className="mr-2" />
          Reset password
        </button>
      </div>

      {isModalOpen && (
        <PasswordResetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PasswordTab;
