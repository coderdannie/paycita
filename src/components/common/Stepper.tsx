import React from "react";

interface StatusStepperProps {
  approvals: Record<string, { status: string }> | null | undefined;
}

interface StepConfig {
  label: string;
  statusKey: string;
  approvalStatus?: string;
}

const StatusStepper: React.FC<StatusStepperProps> = ({ approvals }) => {
  const baseSteps: StepConfig[] = [
    { label: "Submitted", statusKey: "submitted" },
  ];

  const labels = {
    approval_1: "Review",
    approval_2: "Approval",
    approval_3: "Processing",
    approval_4: "Delivered",
  };

  const approvalKeys = Object.keys(labels);

  const approvalSteps: StepConfig[] = approvals
    ? approvalKeys.sort().map((key) => ({
        label: approvals[key as keyof typeof approvals]?.status,
        statusKey: key,
        approvalStatus: approvals[key as keyof typeof approvals]?.status,
      }))
    : [];

  const allStepsConfig: StepConfig[] = [baseSteps[0], ...approvalSteps];

  const getStepState = (
    stepConfig: StepConfig,
    index: number,
    allSteps: StepConfig[]
  ) => {
    let isCompleted = false;
    let isCurrent = false;
    let isRejected = false;

    const firstRejectedIndex = allSteps.findIndex(
      (s) => s.approvalStatus === "rejected"
    );
    const firstPendingIndex = allSteps.findIndex(
      (s) => s.approvalStatus === "pending"
    );

    if (index === 0) {
      isCompleted = allSteps
        .slice(1)
        .some((s) =>
          ["pending", "approved", "rejected"].includes(s.approvalStatus ?? "")
        );

      isCurrent = !isCompleted;
      isRejected = false;
    } else {
      isCompleted = stepConfig.approvalStatus === "approved";
      isRejected = stepConfig.approvalStatus === "rejected";

      isCurrent =
        stepConfig.approvalStatus === "pending" && index === firstPendingIndex;

      if (firstRejectedIndex !== -1 && index > firstRejectedIndex) {
        isCompleted = false;
        isCurrent = false;
        isRejected = stepConfig.approvalStatus === "rejected";
      }

      // If this step itself is rejected, it cannot be current.
      if (isRejected) {
        isCurrent = false;
      }

      // If this step is 'waiting', it's neither completed, current, nor rejected by default.
      if (stepConfig.approvalStatus === "waiting") {
        isCompleted = false;
        isCurrent = false;
        isRejected = false;
        // Exception: If the previous step was approved, maybe mark waiting as current?
        // const prevState = index > 0 ? getStepState(allSteps[index-1], index-1, allSteps) : null;
        // if (prevState?.completed) { isCurrent = true; } // Add this line if waiting should become current after previous approval
      }
    }

    return { completed: isCompleted, current: isCurrent, rejected: isRejected };
  };

  const stepStates = allStepsConfig.map((stepConfig, index) =>
    getStepState(stepConfig, index, allStepsConfig)
  );

  return (
    <div className="w-full py-4 px-2 overflow-x-auto">
      <div className="flex items-start min-w-max">
        {allStepsConfig.map((stepConfig, index) => {
          const state = stepStates[index];
          const isLastStep = index === allStepsConfig.length - 1;

          let circleBorderColor = "border-gray-300";
          let circleBgColor = "bg-white";
          let circleTextColor = "text-gray-300";
          let innerElement = (
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          );
          let labelTextColor = "text-gray-500";
          let connectorBorderColor = "border-gray-300";

          const prevState =
            index > 0
              ? stepStates[index - 1]
              : { completed: false, rejected: false }; // Base case for first step's connector

          if (state.rejected) {
            circleBorderColor = "border-red-500";
            circleBgColor = "bg-red-500";
            circleTextColor = "text-white";
            innerElement = (
              /* X icon */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            );
            labelTextColor = "text-red-500 font-medium";

            connectorBorderColor =
              prevState.completed && !prevState.rejected
                ? "border-[#00AA4F]"
                : "border-gray-300";
          } else if (state.current) {
            circleBorderColor = "border-yellow-500";
            circleBgColor = "bg-yellow-500";
            circleTextColor = "text-white";
            innerElement = (
              <div className="h-2 w-2 rounded-full bg-white"></div>
            );
            labelTextColor = "text-yellow-600 font-medium";

            connectorBorderColor =
              prevState.completed && !prevState.rejected
                ? "border-[#00AA4F]"
                : "border-gray-300";
          } else if (state.completed) {
            // Submitted (if approvals started) or Approved steps
            circleBorderColor = "border-[#00AA4F]";
            circleBgColor = "bg-[#00AA4F]";
            circleTextColor = "text-white";
            innerElement = (
              /* Checkmark */
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
            );
            labelTextColor = "text-[#00AA4F] font-medium";
            connectorBorderColor = "border-[#00AA4F]"; // Connector after completed is green
          }
          // else: Default gray style applies (for 'waiting' steps or future steps after rejection)

          return (
            <React.Fragment key={stepConfig.statusKey}>
              <div className="relative flex flex-col items-center text-center w-28">
                {" "}
                {/* Increased width slightly */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-10
                  ${circleBorderColor} ${circleBgColor} ${circleTextColor}`}
                >
                  {innerElement}
                </div>
                <div className={`text-xs mt-2 capitalize ${labelTextColor}`}>
                  {stepConfig.label}{" "}
                </div>
              </div>

              {!isLastStep && (
                <div
                  className={`flex-auto border-t-[6px] mt-[14px] h-0 transition duration-500 ease-in-out
                  ${connectorBorderColor}`}
                  style={{ minWidth: "2rem" }}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;
