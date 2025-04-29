// filepath: src/components/common/VerticalItemStepper.tsx
import React, { useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { Actor, Approvals } from "@/src/types/procurement";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

interface VerticalItemStepperProps {
  approvals: Approvals;
}

const VerticalItemStepper: React.FC<VerticalItemStepperProps> = ({
  approvals,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  if (!approvals || Object.keys(approvals).length === 0) {
    return (
      <div className="mt-6 p-4 bg-white border border-gray-200 w-full rounded-lg text-center text-gray-500">
        No approval flow data available.
      </div>
    );
  }

  const approvalKeys = Object.keys(approvals).sort();

  return (
    <div className="mt-6 p-4 bg-white border border-gray-200 w-full rounded-lg shadow-sm">
      <div
        className="flex items-center justify-between w-full mb-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <Typography
          as="h6"
          variant="h6"
          color="blue-gray"
          className="mb-4 font-semibold px-2"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Approval Flow
        </Typography>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <IoIosArrowDown />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative ml-4"
          >
            <Timeline>
              {approvalKeys.map((key, index) => {
                const approval = approvals[key as keyof typeof approvals];
                if (!approval) return null;

                let actor: Actor | null | undefined = null;
                let actionDate: string | null | undefined = null;

                if (approval.status === "approved") {
                  actor = approval.approved_by;
                  actionDate = approval.approved_at;
                } else if (approval.status === "rejected") {
                  actor = approval.approved_by;
                  actionDate = approval.rejected_at;
                }

                const actorName = actor?.full_name;
                const actorPicture = actor?.profile_picture;

                const statusDetails = getStatusDetails(approval.status);
                const formattedDate = formatDate(actionDate);

                const isLastItem = index === approvalKeys.length - 1;

                return (
                  <TimelineItem key={key} className="mb-5">
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {!isLastItem && (
                        <TimelineConnector
                          className={`!w-[5px] ${statusDetails.connectorBorderColor}   ml-2.5`}
                        />
                      )}
                      <div className="flex items-start gap-4 relative">
                        <TimelineIcon
                          variant="filled"
                          className={`p-0 w-6 h-6 flex items-center justify-center ${
                            statusDetails.iconBgColor
                          } ${statusDetails.iconBorderColor || "border-none"}`}
                        >
                          {statusDetails.icon}
                        </TimelineIcon>
                        <motion.div
                          className="flex-grow pb-6 border-2 border-gray-200 p-2 rounded-lg"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex items-center gap-3">
                              {actorPicture ? (
                                <Avatar
                                  size="sm"
                                  src={actorPicture}
                                  alt={actorName || "User"}
                                  variant="circular"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                />
                              ) : (
                                <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                                  <UserCircleIcon className="w-6 h-6 text-gray-500" />
                                </div>
                              )}
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {actorName ||
                                  (approval.status === "pending" ||
                                  approval.status === "waiting"
                                    ? "Pending"
                                    : "System")}
                              </Typography>
                            </div>
                            <div className="text-right">
                              <Typography
                                variant="small"
                                className={`font-semibold capitalize ${statusDetails.statusTextColor}`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {approval.status}
                              </Typography>
                              <Typography
                                variant="small"
                                color="gray"
                                className="text-xs"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {formattedDate}
                              </Typography>
                            </div>
                          </div>
                          {approval.status === "rejected" &&
                            approval.rejection_reason && (
                              <div
                                className={`mt-3 ml-9 p-3 rounded-md ${statusDetails.commentBgColor} border border-gray-200 shadow-sm`}
                              >
                                <Typography
                                  variant="small"
                                  color="gray"
                                  className="font-semibold mb-1"
                                  placeholder=""
                                  onPointerEnterCapture={() => {}}
                                  onPointerLeaveCapture={() => {}}
                                >
                                  Comment
                                </Typography>
                                <div className="flex justify-between items-center">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="text-xs flex-grow pr-2"
                                    placeholder=""
                                    onPointerEnterCapture={() => {}}
                                    onPointerLeaveCapture={() => {}}
                                  >
                                    {approval.rejection_reason}
                                  </Typography>
                                  <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-gray-500" />
                                </div>
                              </div>
                            )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerticalItemStepper;

const getStatusDetails = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        icon: <span className="text-white font-bold text-lg">✓</span>, // Checkmark symbol
        iconBgColor: "bg-green-500",
        connectorBorderColor: "bg-green-500", // Line color leaving this step
        statusTextColor: "text-green-500",
        commentBgColor: "bg-white", // Default, not applicable
      };
    case "rejected":
      return {
        icon: <span className="text-white font-bold text-lg">✕</span>, // X symbol (or use ✗)
        iconBgColor: "bg-red-500",
        connectorBorderColor: "bg-red-500", // Line color leaving this step
        statusTextColor: "text-red-500",
        commentBgColor: "bg-gray-100", // Specific background for comment
      };
    case "pending":
      return {
        icon: <span className="h-2.5 w-2.5 bg-yellow-400 rounded-full"></span>, // Inner dot for pending
        iconBgColor: "bg-white", // White background for the outer circle
        iconBorderColor: "border-yellow-400 border-2", // Border for pending icon
        connectorBorderColor: "bg-yellow-300", // Line color leaving this step
        statusTextColor: "text-yellow-600", // Using yellow/orange for pending text like image
        commentBgColor: "bg-white",
      };
    // Add 'waiting' or other statuses if needed, potentially similar to pending
    case "waiting":
    default:
      return {
        icon: <span className="h-2.5 w-2.5 bg-gray-400 rounded-full"></span>, // Default icon like pending
        iconBgColor: "bg-white",
        iconBorderColor: "border-gray-400 border-2",
        connectorBorderColor: "border-gray-300",
        statusTextColor: "text-gray-500",
        commentBgColor: "bg-white",
      };
  }
};

// Simple Date Formatter (adjust locale and options as needed)
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    // Example format: "Mon, 3 Feb 2025"
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric", // Add year if needed based on image context
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};
