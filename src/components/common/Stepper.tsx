import React from 'react';

const StatusStepper = ({ currentStatus }: { currentStatus: string }) => {
  // Helper function to determine step completion based on status
  const getStepState = (stepIndex: number) => {
    const statusOrder = {
      submitted: 0,
      pending: 1,
      approved: 2,
      processing: 3,
      delivered: 4,
    };

    const currentStatusIndex =
      statusOrder[currentStatus?.toLowerCase() as keyof typeof statusOrder] || 0;

    return {
      completed: stepIndex <= currentStatusIndex,
      current: stepIndex === currentStatusIndex,
    };
  };

  // Define all steps in the process
  const steps = [
    {
      label: 'Submitted',
      ...getStepState(0),
    },
    {
      label: 'Review',
      ...getStepState(1),
    },
    {
      label: 'Approval',
      ...getStepState(2),
    },
    {
      label: 'Processing',
      ...getStepState(3),
    },
    {
      label: 'Delivered',
      ...getStepState(4),
    },
  ];

  return (
    <div className="w-full py-4 px-">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 
                ${
                  step.current
                    ? 'bg-[#FFA500] border-[#FFA500] text-white'
                    : step.completed
                    ? 'bg-[#00AA4F] border-[#00AA4F] text-white'
                    : 'bg-white border-gray-300 text-gray-300'
                }`}
              >
                {step.completed && !step.current ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : step.current ? (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                )}
              </div>

              {/* Step label */}
              <div
                className={`text-sm mt-2 
                ${
                  step.current
                    ? 'text-[#FFA500] font-medium'
                    : step.completed
                    ? 'text-[#00AA4F] font-medium'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </div>
            </div>

            {/* Connector line between steps (except after the last step) */}
            {index < steps.length - 1 && (
              <div
                className={`flex-auto border-t-[6px] w-14 h-8 transition px- duration-500 ease-in-out 
                ${step.completed ? 'border-[#00AA4F]' : 'border-gray-300'}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatusStepper;
