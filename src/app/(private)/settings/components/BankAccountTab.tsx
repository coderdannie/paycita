import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import BankDetailsModal from "./modals/BankDetailsModal";


interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const BankAccountTab: React.FC = () => {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "UBA",
    accountNumber: "09354678829",
    accountName: "Sarah Johnson",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateBankDetails = (newDetails: BankDetails) => {
    setBankDetails(newDetails);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 w-full">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Bank Name
            </label>
            <p className="text-gray-800">{bankDetails.bankName}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Account Number
            </label>
            <p className="text-gray-800">{bankDetails.accountNumber}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Account Name
            </label>
            <p className="text-gray-800">{bankDetails.accountName}</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 flex items-center ml-4"
        >
          <FiEdit className="mr-2" />
          Edit Details
        </button>
      </div>

      {isModalOpen && (
        <BankDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentDetails={bankDetails}
          onUpdate={handleUpdateBankDetails}
        />
      )}
    </div>
  );
};

export default BankAccountTab;
