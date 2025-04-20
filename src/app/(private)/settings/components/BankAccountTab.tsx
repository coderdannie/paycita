import React, { useState } from "react";
import BankDetailsModal from "./modals/BankDetailsModal";
import { Pencil } from "lucide-react";
import { useGetAllProfileSettings } from "@/src/hooks/settings/useSettings";

export interface BankDetails {
  id: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
}

const BankAccountTab: React.FC = () => {
  const { profile } = useGetAllProfileSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 w-full">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Bank Name
            </label>
            <p className="text-gray-800">{profile.bank_name ?? "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Account Number
            </label>
            <p className="text-gray-800">
              {profile.bank_account_number ?? "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Account Name
            </label>
            <p className="text-gray-800">
              {profile.bank_account_name ?? "N/A"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#692E9F] text-white text-[.9rem] px-4 py-2 rounded-[.4rem] hover:bg-purple-800 inline-flex items-center whitespace-nowrap"
        >
          <span className="mr-2">Edit Details</span>
          <div className="flex-shrink-0">
            <Pencil
              size={16}
              className="bg-white text-[#692E9F] rounded-sm p-0.5 min-w-[16px]"
            />
          </div>
        </button>
      </div>

      {isModalOpen && (
        <BankDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentDetails={profile}
        />
      )}
    </div>
  );
};

export default BankAccountTab;
