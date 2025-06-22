import React, { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import { useUpdateBasicEmployeeDetails } from "@/src/hooks/dashboard/useDashboard";
import { useParams } from "next/navigation";
import { useToast } from "@/src/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";

const mockEmployeeData = {
  full_name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone_number: "08127954621",
  gender: "Female",
  date_of_birth: "1995-04-25",
  marital_status: "Married",
  department_id: "12345",
  branch_id: "67890",
};

interface Employee {
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  marital_status: string;
  department_id?: string;
  branch_id?: string;
}

interface EditBasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee;
}

const EditBasicInfoModal: React.FC<EditBasicInfoModalProps> = ({
  isOpen,
  onClose,
  employee = mockEmployeeData,
}) => {
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || "",
    email: employee?.email || "",
    phone_number: employee?.phone_number || "",
    gender: employee?.gender || "",
    date_of_birth: employee?.date_of_birth || "",
    marital_status: employee?.marital_status || "",
    department_id: employee?.department_id || "",
    branch_id: employee?.branch_id || "",
  });

  const { id } = useParams();
  const employeeId = id as string;
  const queryClient = useQueryClient();

  const { mutate, isPending } = useUpdateBasicEmployeeDetails();
  const { addToast } = useToast();

  const handleSubmit = () => {
    mutate(
      {
        userId: employeeId,
        data: {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          gender: formData.gender.toLowerCase() as "male" | "female" | "other",
          date_of_birth: formData.date_of_birth,
          marital_status: formData.marital_status.toLowerCase(),
          department_id: formData.department_id,
          branch_id: formData.branch_id,
        },
      },
      {
        onSuccess: () => {
          addToast("Updated successfully", "success");
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          onClose();
        },
        onError: () => {
          addToast("Update failed", "error");
        },
      }
    );
  };

  const [dropdownStates, setDropdownStates] = useState({
    gender: false,
    marital_status: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDropdown = (field: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const formatDateForDisplay = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const genderOptions = ["Male", "Female", "Other"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Edit Basic Info</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter phone number"
              />
            </div>

            {/* Gender */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("gender")}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-left flex items-center justify-between bg-white"
                >
                  <span
                    className={
                      formData.gender ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {formData.gender || "Select gender"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      dropdownStates.gender ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownStates.gender && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {genderOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          handleInputChange("gender", option);
                          toggleDropdown("gender");
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    handleInputChange("date_of_birth", e.target.value)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {formData.date_of_birth && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateForDisplay(formData.date_of_birth)}
                </p>
              )}
            </div>

            {/* Marital Status */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("marital_status")}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-left flex items-center justify-between bg-white"
                >
                  <span
                    className={
                      formData.marital_status
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    {formData.marital_status || "Select marital status"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      dropdownStates.marital_status ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownStates.marital_status && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {maritalStatusOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          handleInputChange("marital_status", option);
                          toggleDropdown("marital_status");
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-gray-200 px-6 py-4">
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md font-medium border border-[#692E9F] text-[#692E9F] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isPending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#692E9F] text-white hover:bg-[#5a2585]"
              }`}
            >
              {isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBasicInfoModal;
