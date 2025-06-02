import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface PayrollTaxData {
  salary: string;
  tax_status?: string;
  tax_number?: string;
  tax_method?: string;
  pension_company?: string;
}

interface EmployeeData {
  id: number;
  employee_number: string;
  full_name?: string;
  job_title: string;
  job_level: string;
  employment_type: string;
  job_location: string;
  hire_date: string;
  salary: string;
  email?: string;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  department: {
    id: number;
    name: string;
  };
}

interface EditPayrollTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeData;
  onSave: (updatedData: Partial<EmployeeData>) => void;
}

const EditPayrollTaxModal: React.FC<EditPayrollTaxModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSave,
}) => {
  const [formData, setFormData] = useState<PayrollTaxData>({
    salary: "",
    tax_status: "",
    tax_number: "",
    tax_method: "",
    pension_company: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        salary: employee.salary || "",
        tax_status: "Active Taxpayer", // Default from the image
        tax_number: "121379847343539", // Default from the code
        tax_method: "Gross", // Default from the image
        pension_company: "ARM Pensions", // Default from the image
      });
    }
  }, [isOpen, employee]);

  const handleInputChange = (field: keyof PayrollTaxData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Convert salary to proper format if needed
      const updatedData = {
        ...formData,
        salary: formData.salary.replace(/[^0-9.]/g, ""), // Remove non-numeric characters except decimal
      };

      await onSave(updatedData);
      onClose();
    } catch (error) {
      console.error("Error saving payroll data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      salary: employee.salary || "",
      tax_status: "Active Taxpayer",
      tax_number: "121379847343539",
      tax_method: "Gross",
      pension_company: "ARM Pensions",
    });
    onClose();
  };

  const formatSalaryInput = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    // Add dollar sign and format
    return numericValue ? `$${numericValue}` : "";
  };

  const taxStatusOptions = [
    "Active Taxpayer",
    "Inactive Taxpayer",
    "Exempt",
    "Non-Resident",
  ];

  const taxMethodOptions = ["Gross", "Net", "PAYE", "Fixed Rate"];

  const pensionCompanyOptions = [
    "ARM Pensions",
    "Leadway Pensure",
    "Premium Pension",
    "Stanbic IBTC Pension",
    "AXA Mansard Pension",
    "Other",
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-10 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Payroll & Tax
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Basic Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Basic Salary
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const formatted = formatSalaryInput(e.target.value);
                  handleInputChange("salary", formatted);
                }}
                placeholder="$2,679"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            {/* Tax Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Status
              </label>
              <select
                value={formData.tax_status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange("tax_status", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Tax Status</option>
                {taxStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Tax Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Number
              </label>
              <input
                type="text"
                value={formData.tax_number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("tax_number", e.target.value)
                }
                placeholder="121379847343539"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            {/* Tax Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Method
              </label>
              <select
                value={formData.tax_method}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange("tax_method", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Tax Method</option>
                {taxMethodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Pension Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pension Company
              </label>
              <select
                value={formData.pension_company}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange("pension_company", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Pension Company</option>
                {pensionCompanyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium border border-[#692E9F] text-[#692E9F] rounded-md hover:bg-[#692E9F] hover:text-white transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-[#692E9F] text-white rounded-md hover:bg-[#692E9F]/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPayrollTaxModal;
