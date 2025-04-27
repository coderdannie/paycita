import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbCircleCheckFilled } from "react-icons/tb";
import { MdCancel } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { Approvals, Actor } from "@/src/types/procurement";

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

export const ApprovalFlow = ({ approvals }: { approvals: Approvals }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!approvals || Object.keys(approvals).length === 0) {
    return (
      <div className="bg-white rounded-xl border p-4 text-center text-gray-500">
        No approval flow data available.
      </div>
    );
  }

  const approvalKeys = Object.keys(approvals).sort();

  return (
    <div className="bg-white rounded-xl border p-4">
      <div
        className="flex items-center justify-between w-full mb-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <h3 className="text-lg font-semibold">Approval Flow</h3>
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative ml-4 overflow-hidden"
          >
            {approvalKeys.map((key, index) => {
              const approval = approvals[key as keyof typeof approvals];
              if (!approval) return null;

              const {
                status,
                approved_by,
                approved_at,
                rejected_at,
                rejection_reason,
              } = approval;
              const actor: Actor | null = approved_by;

              const isApproved = status === "approved";
              const isRejected = status === "rejected";
              const isPending = status === "pending";
              const isWaiting = status === "waiting";

              const actionDate = isApproved
                ? approved_at
                : isRejected
                ? rejected_at
                : null;
              const formattedDate = formatDate(actionDate);
              const actorName =
                actor?.full_name ||
                (isPending || isWaiting ? "Pending Action" : "System");
              const actorPicture = actor?.profile_picture;

              const lineColor = isApproved
                ? "bg-green-500"
                : isRejected
                ? "bg-red-500"
                : isPending
                ? "bg-yellow-400"
                : "bg-gray-300";

              return (
                <motion.div
                  key={key}
                  className="relative pl-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {index !== approvalKeys.length - 1 && (
                    <div
                      className={`absolute left-[7.5px] top-6 h-full w-2 rounded-full ${lineColor}`}
                    />
                  )}

                  <div className="absolute -left-[0.5px] top-1.5 z-10 text-2xl">
                    {isApproved && (
                      <TbCircleCheckFilled className="text-green-500 bg-white rounded-full" />
                    )}
                    {isRejected && (
                      <MdCancel className="text-red-500 bg-white rounded-full" />
                    )}
                    {isPending && (
                      <FaRegCircle className="text-yellow-500 bg-white rounded-full" />
                    )}
                    {isWaiting && (
                      <IoMdTime className="text-gray-500 bg-white rounded-full" />
                    )}
                  </div>

                  <div className="ml-6 mb-6">
                    <motion.div
                      className="flex justify-between items-center flex-wrap gap-2 border border-[#E4E7EC] rounded-[10px] px-[10px] py-3"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-2">
                        {actorPicture ? (
                          <Image
                            src={actorPicture}
                            alt={actorName}
                            width={40}
                            height={40}
                            className="rounded-full w-10 h-10 object-cover"
                          />
                        ) : (
                          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                            <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">
                              {actorName.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium">{actorName}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-sm font-semibold capitalize ${
                            isApproved
                              ? "text-green-600"
                              : isRejected
                              ? "text-red-500"
                              : isPending
                              ? "text-yellow-600"
                              : "text-gray-500"
                          }`}
                        >
                          {status}
                        </span>
                        {formattedDate && (
                          <p className="text-sm text-gray-500 mt-1">
                            {formattedDate}
                          </p>
                        )}
                      </div>
                      {isRejected && rejection_reason && (
                        <motion.div
                          className="bg-gray-50 border rounded-lg mt-3 p-3 w-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <p className="text-sm font-medium mb-1 border-b border-[#E4E7EC]">
                            Comment
                          </p>
                          <div className="text-sm text-gray-700 flex items-start justify-between gap-2">
                            {rejection_reason}
                            <div>
                              <Image
                                src="/assets/messages.png"
                                alt="message icon"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
