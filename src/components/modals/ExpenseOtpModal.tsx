"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";

import toast from "react-hot-toast";
import useApiRequest from "@/src/hooks/useApiRequest";
import { useScrollLock } from "../common/useScrollLock";

interface ExpensesOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  callback: () => void;
  approvalStatusId: string;
  url?: string;
  payload?: any;
}

const ExpensesOTPModal: React.FC<ExpensesOTPModalProps> = ({
  isOpen,
  onClose,
  approvalStatusId,
  callback,
  url,
  payload,
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""]);
  const [countdown, setCountdown] = useState(5);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { postRequest, loading } = useApiRequest();
  const { getRequest, loading: isResendingOtp } = useApiRequest();

  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  useEffect(() => {
    if (isOpen) {
      setOtpValues(["", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newValues = [...otpValues];

    for (let i = 0; i < Math.min(pastedData.length, 4); i++) {
      newValues[i] = pastedData[i];
    }
    setOtpValues(newValues);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleConfirm = async () => {
    const otp = otpValues.join("");
    if (otp.length === 4) {
      await postRequest(
        url || "/user/verify-payment-otp",
        {
          otp,
          ...payload,
        },
        (data) => {
          if (data.success) {
            callback?.();
            onClose();
          }
        }
      );
    }
  };

  const handleResend = async () => {
    console.log(approvalStatusId);
    await getRequest(
      `/user/resend-otp/${approvalStatusId}`,
      (data) => {
        if (data.success) {
          toast.success(data?.message);
          setCountdown(5);
        }
      },
      { forceRefresh: true }
    );
  };

  const isOtpComplete = otpValues.every((value) => value !== "");

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "bg-opacity-50" : "bg-opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } w-screen max-w-md`}
        >
          <div className="flex h-full flex-col rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Expenses Request
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={onClose}
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Request Details */}

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Confirm Approval
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  We&apos;ve sent 4 digit verification code to your registered
                  email
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-4">
                  Please enter the code below to confirm this approval.
                </p>

                {/* OTP Input Fields */}
                <div className="flex justify-center space-x-3 mb-4">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#692E9F] focus:border-transparent"
                    />
                  ))}
                </div>

                {/* Resend Code */}
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Didn&apos;t get Code?{" "}
                  </span>
                  {countdown > 0 ? (
                    <span className="text-sm text-[#692E9F]">
                      Resend in {countdown} sec
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="text-sm text-[#692E9F] hover:underline focus:outline-none"
                    >
                      {isResendingOtp ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        "Resend"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Footer with Confirm Button */}
            <div className="border-gray-200 p-6">
              <button
                onClick={handleConfirm}
                disabled={!isOtpComplete || loading}
                className="w-full py-3 px-4 bg-[#692E9F] text-white font-medium rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#692E9F] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                )}
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesOTPModal;
