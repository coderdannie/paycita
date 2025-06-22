import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import {
  useGetAllBranches,
  useGetDepartments,
} from '@/src/hooks/dashboard/useDashboard';

interface Employee {
  id: number;
  employee_number: string;
  full_name?: string;
  job_title: string;
  job_level: string;
  employment_type: string;
  job_location: string;
  hire_date: string;
  email?: string;
  salary: string;
  department?: {
    id: number;
    name: string;
  };
  branch?: {
    id: number;
    name: string;
  };
}

interface EditBasicInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onSave?: (updatedData: Partial<Employee>) => void;
  isUpdating: boolean;
}

const EditBasicInformationModal: React.FC<EditBasicInformationModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSave,
  isUpdating,
}) => {
  const { allBranchesOptions } = useGetAllBranches();

  console.log('id', employee.branch?.id);

  const [formData, setFormData] = useState({
    full_name: employee.full_name || '',
    job_title: employee.job_title || '',
    job_level: employee.job_level || '',
    department: employee.department?.name || '',
    branch_id: employee.branch?.name,
    employment_type: employee.employment_type || '',
    email: employee.email || '',
    job_location: employee.job_location || '',
    hire_date: employee.hire_date
      ? new Date(employee.hire_date).toISOString().split('T')[0]
      : '',
  });

  const { departmentOptions } = useGetDepartments();

  const jobLevelOptions = ['Staff', 'Mid', 'Senior', 'Executive'];

  const employmentTypeOptions = ['Full-time', 'Part-time', 'Contract'];

  // Location type options - using job_location field
  const locationTypeOptions = ['Remote', 'On-site', 'Hybrid'];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      // Find the selected department
      const selectedDepartment = departmentOptions.find(
        (dept) => dept.label === formData.department
      );

      // Find the selected branch
      const selectedBranch = allBranchesOptions.find(
        (branch) => branch.label === formData.branch_id
      );

      onSave({
        ...formData,
        department: {
          id: selectedDepartment?.value || employee.department?.id || 0,
          name: formData.department,
        },
        branch: {
          id: selectedBranch?.value || employee.branch?.id || 0,
          name: selectedBranch?.label || employee.branch?.name || '',
        },
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      full_name: employee.full_name || '',
      job_title: employee.job_title || '',
      job_level: employee.job_level || '',
      department: employee.department?.name || '',
      employment_type: employee.employment_type || '',
      email: employee.email || '',
      job_location: employee.job_location || '',
      branch_id: employee.branch.name,
      hire_date: employee.hire_date
        ? new Date(employee.hire_date).toISOString().split('T')[0]
        : '',
    });
    onClose();
  };

  // Reset form when employee changes
  useEffect(() => {
    setFormData({
      full_name: employee.full_name || '',
      job_title: employee.job_title || '',
      job_level: employee.job_level || '',
      department: employee.department?.name || '',
      employment_type: employee.employment_type || '',
      email: employee.email || '',
      job_location: employee.job_location || '',
      branch_id: employee?.branch.name || '',
      hire_date: employee.hire_date
        ? new Date(employee.hire_date).toISOString().split('T')[0]
        : '',
    });
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Basic Information
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    handleInputChange('full_name', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter employee name"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <div className="relative">
                  <input
                    type="job_title"
                    value={formData.job_title}
                    onChange={(e) =>
                      handleInputChange('job_title', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Frontend Engineer"
                  />

                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Job Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Level
                </label>
                <div className="relative">
                  <select
                    value={formData.job_level}
                    onChange={(e) =>
                      handleInputChange('job_level', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select job level</option>
                    {jobLevelOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange('department', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select department</option>
                    {departmentOptions?.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <div className="relative">
                  <select
                    value={formData.branch_id}
                    onChange={(e) =>
                      handleInputChange('branch_id', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select branch</option>
                    {allBranchesOptions?.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <div className="relative">
                  <select
                    value={formData.employment_type}
                    onChange={(e) =>
                      handleInputChange('employment_type', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select employment type</option>
                    {employmentTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Company Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="employee@company.com"
                />
              </div>

              {/* Job Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Location
                </label>
                <div className="relative">
                  <select
                    value={formData.job_location}
                    onChange={(e) =>
                      handleInputChange('job_location', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select job location</option>
                    {locationTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hire Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hire Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) =>
                      handleInputChange('hire_date', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium border border-[#692E9F] text-[#692E9F] rounded-md hover:bg-[#692E9F] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
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
    </>
  );
};

export default EditBasicInformationModal;
