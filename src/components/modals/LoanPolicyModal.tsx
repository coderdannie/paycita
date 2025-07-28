import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { LoanPolicyData } from '@/src/types/loan';

type ModalMode = 'add' | 'edit';

interface LoanPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LoanPolicyData) => void;
  mode: ModalMode;
  initialData?: LoanPolicyData;
  isPendingCreateEvent: boolean;
}

// Modal Component
const LoanPolicyModal: React.FC<LoanPolicyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData = {
    loan_type: '',
    policy_name: '',
    eligibility: '',
    loan_limit: '',
    repayment_period: '',
  },
  isPendingCreateEvent,
}) => {
  const [formData, setFormData] = useState<LoanPolicyData>(() => {
    // Initialize form data based on mode
    if (mode === 'add') {
      return {
        loan_type: '',
        policy_name: '',
        eligibility: '',
        loan_limit: '',
        repayment_period: '',
      };
    }
    return initialData;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [lastOpenState, setLastOpenState] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const repaymentOptions: string[] = ['Payroll Deduction'];

  // Only update form data when modal is opened, not on every render
  useEffect(() => {
    if (isOpen && !lastOpenState) {
      // Modal just opened
      if (mode === 'add') {
        setFormData({
          loan_type: '',
          policy_name: '',
          eligibility: '',
          loan_limit: '',
          repayment_period: 'Payroll Deduction',
        });
      } else if (initialData) {
        setFormData(initialData);
      }
      // Clear errors when modal opens
      setErrors({});
    }
    setLastOpenState(isOpen);
  }, [isOpen, mode]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.policy_name.trim()) {
      newErrors.policy_name = 'Policy name is required';
    }

    if (!formData.eligibility.trim()) {
      newErrors.eligibility = 'Eligibility criteria is required';
    }

    if (!formData.loan_limit.trim()) {
      newErrors.loan_limit = 'Maximum loan limit is required';
    }

    if (!formData.repayment_period.trim()) {
      newErrors.repayment_period = 'Repayment method is required';
    }

    if (!formData.loan_type.trim()) {
      newErrors.loan_type = 'Loan type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for button state
  const isFormValid = (): boolean => {
    return !!(
      formData.loan_type.trim() &&
      formData.policy_name.trim() &&
      formData.eligibility.trim() &&
      formData.loan_limit.trim() &&
      formData.repayment_period.trim()
    );
  };

  // Get modal content based on mode
  const getModalTitle = (): string => {
    return mode === 'add' ? 'Add Loan Policy' : 'Loan policy';
  };

  const getModalDescription = (): string => {
    return mode === 'add'
      ? 'Create a new loan policy for your organization.'
      : 'Edit your information to keep us updated.';
  };

  const getButtonText = (): string => {
    return mode === 'add'
      ? `${isPendingCreateEvent ? 'loading...' : 'Add Policy'}`
      : 'Save Changes';
  };

  const handleInputChange = (
    field: keyof LoanPolicyData,
    value: string
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

  const handleSubmit = (): void => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    return `${parseInt(numericValue).toLocaleString()}`;
  };

  const handleMaxLoanLimitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const formatted = formatCurrency(e.target.value);
    handleInputChange('loan_limit', formatted);
  };

  const handleRepaymentMethodSelect = (method: string): void => {
    handleInputChange('repayment_period', method);
    setIsDropdownOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {getModalTitle()}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-600 mt-1">{getModalDescription()}</p>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Loan Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.loan_type}
              onChange={(e) => handleInputChange('loan_type', e.target.value)}
              placeholder="Staff loan"
              className={`w-full px-3 py-2.5 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.loan_type
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              required
            />
            {errors.loan_type && (
              <p className="text-sm text-red-600">{errors.loan_type}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Policy Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.policy_name}
              onChange={(e) => handleInputChange('policy_name', e.target.value)}
              placeholder="Staff Emergency Loan Policy"
              className={`w-full px-3 py-2.5 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.policy_name
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              required
            />
            {errors.policy_name && (
              <p className="text-sm text-red-600">{errors.policy_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Eligibility <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.eligibility}
              onChange={(e) => handleInputChange('eligibility', e.target.value)}
              placeholder="Must have completed 6 months of employment"
              className={`w-full px-3 py-2.5 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.eligibility
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              required
            />
            {errors.eligibility && (
              <p className="text-sm text-red-600">{errors.eligibility}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Maximum Loan Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.loan_limit}
              onChange={handleMaxLoanLimitChange}
              placeholder="₦150,000"
              className={`w-full px-3 py-2.5 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.loan_limit
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              required
            />
            {errors.loan_limit && (
              <p className="text-sm text-red-600">{errors.loan_limit}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Repayment Method <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-3 py-2.5 border rounded-md text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between ${
                  errors.repayment_period
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
              >
                <span className="text-gray-900">
                  {formData.repayment_period}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {repaymentOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleRepaymentMethodSelect(option)}
                      className="w-full px-3 py-2.5 text-sm text-left text-gray-900 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.repayment_period && (
              <p className="text-sm text-red-600">{errors.repayment_period}</p>
            )}
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid() || isPendingCreateEvent}
            className={`w-full h-[40px] ${
              !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {getButtonText()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanPolicyModal;
