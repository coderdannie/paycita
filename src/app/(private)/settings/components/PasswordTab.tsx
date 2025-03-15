import React, { useState } from "react";
import PasswordResetModal from "./modals/PasswordResetModal";
import { Pencil } from "lucide-react";

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
          className="bg-[#692E9F] text-white text-[.95rem]  px-4 py-2 rounded-[.4rem] hover:bg-purple-800 flex items-center"
        >
          Reset password
          <Pencil
            size={18}
            className="text-[#692E9F] bg-white rounded-[.4rem] p-[.1rem] ml-2"
          />
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
