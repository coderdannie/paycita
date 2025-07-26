import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

// Types
interface LoanPolicyData {
  policyName: string;
  eligibility: string;
  maxLoanLimit: string;
  repaymentMethod: string;
}

type ModalMode = 'add' | 'edit';

interface LoanPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LoanPolicyData) => void;
  mode: ModalMode;
  initialData?: LoanPolicyData;
}

// Modal Component
const LoanPolicyModal: React.FC<LoanPolicyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData = {
    policyName: '',
    eligibility: '',
    maxLoanLimit: '',
    repaymentMethod: 'Payroll Deduction',
  },
}) => {
  const [formData, setFormData] = useState<LoanPolicyData>(() => {
    // Initialize form data based on mode
    if (mode === 'add') {
      return {
        policyName: '',
        eligibility: '',
        maxLoanLimit: '',
        repaymentMethod: 'Payroll Deduction',
      };
    }
    return initialData;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [lastOpenState, setLastOpenState] = useState<boolean>(false);

  const repaymentOptions: string[] = [
    'Payroll Deduction',
    'Bank Transfer',
    'Cash Payment',
    'Check Payment',
  ];

  // Only update form data when modal is opened, not on every render
  useEffect(() => {
    if (isOpen && !lastOpenState) {
      // Modal just opened
      if (mode === 'add') {
        setFormData({
          policyName: '',
          eligibility: '',
          maxLoanLimit: '',
          repaymentMethod: 'Payroll Deduction',
        });
      } else if (initialData) {
        setFormData(initialData);
      }
    }
    setLastOpenState(isOpen);
  }, [isOpen, mode]);

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
    return mode === 'add' ? 'Add Policy' : 'Save Changes';
  };

  const handleInputChange = (
    field: keyof LoanPolicyData,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (): void => {
    onSubmit(formData);
    onClose();
  };

  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    return `₦${parseInt(numericValue).toLocaleString()}`;
  };

  const handleMaxLoanLimitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const formatted = formatCurrency(e.target.value);
    handleInputChange('maxLoanLimit', formatted);
  };

  const handleRepaymentMethodSelect = (method: string): void => {
    handleInputChange('repaymentMethod', method);
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
              Policy Name
            </label>
            <input
              type="text"
              value={formData.policyName}
              onChange={(e) => handleInputChange('policyName', e.target.value)}
              placeholder="Staff Emergency Loan Policy"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Eligibility
            </label>
            <input
              type="text"
              value={formData.eligibility}
              onChange={(e) => handleInputChange('eligibility', e.target.value)}
              placeholder="Must have completed 6 months of employment"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Maximum Loan Limit
            </label>
            <input
              type="text"
              value={formData.maxLoanLimit}
              onChange={handleMaxLoanLimitChange}
              placeholder="₦150,000"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Repayment Method
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between"
              >
                <span className="text-gray-900">
                  {formData.repaymentMethod}
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
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full h-[40px] "
          >
            {getButtonText()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanPolicyModal;
