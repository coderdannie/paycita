import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuthSelector } from '@/src/Redux/selectors';

// Props interface for OTP Input component
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

// Props interface for ExpensesApprovalModal
interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  isVerifying: boolean;
  onResend: () => void;
  timeLeft: number;
  setTimeLeft: (prop: number) => void;
  isResending: boolean;
}

// OTP Input Component
const OTPInput: React.FC<OTPInputProps> = ({ onChange, length = 6 }) => {
  const [inputs, setInputs] = useState<string[]>(new Array(length).fill(''));

  const handleChange = (element: HTMLInputElement, index: number): void => {
    if (isNaN(Number(element.value))) return;

    const newInputs = [...inputs];
    newInputs[index] = element.value;
    setInputs(newInputs);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }

    // Call parent onChange
    onChange(newInputs.join(''));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (
      e.key === 'Backspace' &&
      !inputs[index] &&
      e.currentTarget.previousSibling
    ) {
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {inputs.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
};

// Main ExpensesApprovalModal Component
const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  isVerifying,
  onResend,
  timeLeft,
  setTimeLeft,
  isResending,
}) => {
  const [otpCode, setOtpCode] = useState<string>('');
  const userData = useAuthSelector();

  // Timer countdown effect - only runs when not resending
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen && timeLeft > 0 && !isResending) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [isOpen, timeLeft, setTimeLeft, isResending]);

  // Reset OTP code and timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtpCode('');
      setTimeLeft(180); // 3 minutes
    }
  }, [isOpen, setTimeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleResend = () => {
    // Reset timer to 3 minutes when resend is clicked
    setTimeLeft(180);
    onResend();
  };

  const handleConfirmApproval = (): void => {
    if (onVerify) {
      onVerify(otpCode);
    }
    setOtpCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Verify Otp</h2>
          <button
            onClick={() => onClose && onClose()}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Confirmation Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Confirm Approval
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              We`ve sent a 4-digit verification code to your registered email{' '}
              <span className="text-gray-800 font-medium">
                {userData?.user?.email}
              </span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-4 text-center">
              Please enter the code below to confirm this approval.
            </p>
            <OTPInput value={otpCode} onChange={setOtpCode} length={4} />
          </div>

          {/* Resend Code */}
          <div className="text-center mb-6">
            {timeLeft > 0 || isResending ? (
              <p className="text-sm text-gray-500">
                Didn`t get code? Resend in {formatTime(timeLeft)}
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-primary hover:text-purple-700 font-medium"
              >
                Didn`t get code? Resend
              </button>
            )}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmApproval}
            disabled={otpCode.length !== 4 || isVerifying || isResending}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Confirm Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ApprovalModal;
export type { ApprovalModalProps, OTPInputProps };
