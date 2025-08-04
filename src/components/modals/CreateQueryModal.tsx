import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import Select from 'react-select';
import { EmployeeQuery } from '@/src/types/queryMgt';
import { useGetAllUsers } from '@/src/hooks/query-mgt/useQueryMgt';

interface CreateQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeQuery) => void;
  isPending?: boolean;
}

// Define the option type for React Select
interface OptionType {
  value: string;
  label: string;
}

const CreateQueryModal: React.FC<CreateQueryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
}) => {
  const [formData, setFormData] = useState<EmployeeQuery>({
    title: '',
    message: '',
    priority: '',
    user_id: '',
  });

  const { allUsers, isPending: isLoading } = useGetAllUsers();

  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priorityOptions: string[] = ['high', 'medium', 'low'];

  // Map through actual allUsers data to create options for React Select
  const employeeOptions: OptionType[] =
    allUsers?.map((employee) => ({
      value: employee.id.toString(),
      label: employee.full_name,
    })) || [];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        message: '',
        priority: '',
        user_id: '',
      });
      setErrors({});
      setIsPriorityDropdownOpen(false);
    }
  }, [isOpen]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Description is required';
    }

    if (!formData.priority.trim()) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.user_id || !formData.user_id.trim()) {
      newErrors.user_id = 'Assignment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for button state
  const isFormValid = (): boolean => {
    return !!(
      formData.title.trim() &&
      formData.message.trim() &&
      formData.priority.trim() &&
      formData.user_id &&
      formData.user_id.trim()
    );
  };

  const handleInputChange = (
    field: keyof EmployeeQuery,
    value: string | number
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handlePrioritySelect = (priority: string): void => {
    handleInputChange('priority', priority);
    setIsPriorityDropdownOpen(false);
  };

  const handleAssigneeSelect = (selectedOption: OptionType | null): void => {
    const employeeId = selectedOption ? selectedOption.value : '';
    handleInputChange('user_id', employeeId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create Query
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-900"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter a brief title for the query"
              className={`w-full px-3 py-3 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Add more details so the person you're assigning it to understands what's going on."
              rows={4}
              className={`w-full px-3 py-3 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {/* Priority Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Priority
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                }
                className={`w-full px-3 py-3 border rounded-md text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between ${
                  errors.priority
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
              >
                <span
                  className={
                    formData.priority ? 'text-gray-900' : 'text-gray-400'
                  }
                >
                  {formData.priority || 'Select priority'}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isPriorityDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isPriorityDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {priorityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handlePrioritySelect(option)}
                      className="w-full px-3 py-3 text-sm text-left text-gray-900 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.priority && (
              <p className="text-sm text-red-600">{errors.priority}</p>
            )}
          </div>

          {/* Assign to Field */}
          <div className="space-y-2">
            <label
              htmlFor="user_id"
              className="text-sm font-medium text-gray-900"
            >
              Assign to
            </label>
            <Select
              id="user_id"
              options={employeeOptions}
              value={employeeOptions.find(
                (option) => option.value === formData.user_id
              )}
              onChange={handleAssigneeSelect}
              placeholder="Select employees to respond to this query?"
              isSearchable
              isLoading={isLoading}
              className={`react-select-container ${
                errors.user_id ? 'react-select-error' : ''
              }`}
              classNamePrefix="react-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: '48px',
                  padding: '4px 8px',
                  border: errors.user_id
                    ? '1px solid #FCA5A5'
                    : '1px solid #D1D5DB',
                  backgroundColor: errors.user_id ? '#FEF2F2' : 'white',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxShadow: state.isFocused
                    ? '0 0 0 2px rgb(147 51 234 / 0.5)'
                    : 'none',
                  borderColor: state.isFocused
                    ? '#9333EA'
                    : errors.user_id
                    ? '#FCA5A5'
                    : '#D1D5DB',
                  '&:hover': {
                    borderColor: state.isFocused
                      ? '#9333EA'
                      : errors.user_id
                      ? '#FCA5A5'
                      : '#D1D5DB',
                  },
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#9CA3AF',
                }),
              }}
            />
            {errors.user_id && (
              <p className="text-sm text-red-600">{errors.user_id}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid() || isPending}
            className={`w-full h-[40px] ${
              !isFormValid() || isPending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isPending ? 'Creating...' : 'Create Query'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQueryModal;
