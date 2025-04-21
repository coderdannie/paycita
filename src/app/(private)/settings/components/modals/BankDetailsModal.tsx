import React from "react";
import { FiX } from "react-icons/fi";
import { BankDetails } from "../BankAccountTab";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddBankDetails } from "@/src/hooks/settings/useSettings";
import toast from "react-hot-toast";

const bankDetailsSchema = z.object({
  bank_name: z.string().min(1, "Bank name is required"),
  bank_account_number: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(10, "Account number must be 10 digits"),
  bank_account_name: z.string().min(1, "Account name is required"),
});

type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;

interface BankDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: BankDetails;
}

const BankDetailsModal: React.FC<BankDetailsModalProps> = ({
  isOpen,
  onClose,
  currentDetails,
}) => {
  const { mutate: addBankDetails, isPending: isAdding } = useAddBankDetails();
  const isPending = isAdding;

  const form = useForm<BankDetailsFormValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      bank_name: currentDetails.bank_name || "",
      bank_account_number: currentDetails.bank_account_number || "",
      bank_account_name: currentDetails.bank_account_name || "",
    },
  });

  const onSubmit = async (data: BankDetailsFormValues) => {
    addBankDetails(
      {
        bank_name: data.bank_name,
        bank_account_number: data.bank_account_number,
        account_name: data.bank_account_name,
      },
      {
        onSuccess: () => {
          toast.success("Bank details added successfully");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add bank details");
        },
      }
    );

    // if (currentDetails.id) {
    //   // Update existing bank details
    //   updateBankDetails(
    //     {
    //       id: currentDetails.id,
    //       bank_name: data.bank_name,
    //       bank_account_number: data.bank_account_number,
    //       account_name: data.bank_account_name,
    //     },
    //     {
    //       onSuccess: () => {
    //         toast.success("Bank details updated successfully");
    //         onClose();
    //       },
    //       onError: (error) => {
    //         toast.error(error.message || "Failed to update bank details");
    //       },
    //     }
    //   );
    // } else {
    //   // Add new bank details
    //   addBankDetails(
    //     {
    //       bank_name: data.bank_name,
    //       bank_account_number: data.bank_account_number,
    //       account_name: data.bank_account_name,
    //     },
    //     {
    //       onSuccess: () => {
    //         toast.success("Bank details added successfully");
    //         onClose();
    //       },
    //       onError: (error) => {
    //         toast.error(error.message || "Failed to add bank details");
    //       },
    //     }
    //   );
    // }
  };

  if (!isOpen) return null;

  const bankOptions = [
    "UBA",
    "Access Bank",
    "Zenith Bank",
    "GTBank",
    "First Bank",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {currentDetails.id ? "Update Bank Account" : "Add Bank Account"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <p className="mb-4 text-sm text-gray-600">
              Please provide your valid bank account information for payouts
            </p>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Your Bank
                </label>
                <select
                  {...form.register("bank_name")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select a bank</option>
                  {bankOptions.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                {form.formState.errors.bank_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.bank_name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  {...form.register("bank_account_number")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {form.formState.errors.bank_account_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.bank_account_number.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  {...form.register("bank_account_name")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {form.formState.errors.bank_account_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.bank_account_name.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? currentDetails.id
                      ? "Updating..."
                      : "Adding..."
                    : currentDetails.id
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;
