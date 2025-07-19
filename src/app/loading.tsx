import React from "react";
import Image from "next/image";

interface LoadingPageProps {
  fullPage?: boolean;
  size?: "small" | "medium" | "large";
  text?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  fullPage = true,
  size = "large",
  text = "Loading Paycita",
}) => {
  const sizeClasses = {
    small: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12",
    medium: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
    large:
      "w-[320px] h-[180px] sm:w-[400px] sm:h-[220px] md:w-[480px] md:h-[260px]",
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-xl",
  };

  if (fullPage) {
    return (
      <div className="min-h-screen bg-gray_1 flex items-center justify-center px-4">
        <div className="text-center">
          {/* Company Logo */}
          <div className="mb-8">
            <Image
              src="/paycita.svg"
              alt="Paycita Logo"
              width={140}
              height={45}
              className="mx-auto"
              priority
            />
          </div>

          {/* Loading Animation */}
          <div className="mb-6">
            <div className="relative w-16 h-16 mx-auto">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>

              {/* Inner spinning ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin-very-slow"></div>

              {/* Inner dot */}
              <div className="absolute inset-4 bg-purple-100 rounded-full animate-pulse-very-slow"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">{text}</h2>
            <p className="text-gray-500 text-sm">
              Please wait while we prepare your workspace...
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce-very-slow"></div>
            <div
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce-very-slow"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce-very-slow"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Inline loading component
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative ${sizeClasses[size]} mb-4`}>
        <Image
          src="/paycita.svg"
          alt="Paycita Logo"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Loading Animation */}
      <div className="mb-4">
        <div className="relative w-8 h-8 mx-auto">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>

          {/* Inner spinning ring */}
          <div className="absolute inset-0 border-2 border-transparent border-t-purple-600 rounded-full animate-spin"></div>

          {/* Inner dot */}
          <div className="absolute inset-2 bg-purple-100 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Loading Text */}
      <p className={`${textSizes[size]} font-medium text-gray-700 text-center`}>
        {text}
      </p>
    </div>
  );
};

export default LoadingPage;
