import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { MdCancel } from 'react-icons/md';
import { FaRegCircle } from 'react-icons/fa6';
import Image from 'next/image';
import { IoIosArrowDown } from 'react-icons/io';
import { ApprovalStep } from '@/src/types/procurement';

export const ApprovalFlow = ({ steps }: { steps: ApprovalStep[] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
            initial={{ opacity: 1, height: 'auto' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative ml-4"
          >
            {steps.map((step, index) => {
              const isApproved = step.status === 'approved';
              const isRejected = step.status === 'rejected';
              const isPending = step.status === 'pending';

              // Determine line color
              const isCurrentOrPast =
                index <=
                steps.findIndex(
                  (s) => s.status === 'rejected' || s.status === 'approved'
                );
              const lineColor = isCurrentOrPast
                ? 'bg-[#00AA4F]'
                : 'bg-gray-200';

              return (
                <motion.div
                  key={index}
                  className="relative pl-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {/* Vertical line segment */}
                  {index !== steps.length - 1 && (
                    <div
                      className={`absolute left-[5px] top-6 h-full w-2 rounded-full ${lineColor}`}
                    />
                  )}

                  {/* Step Icon */}
                  <div className="absolute -left-0.5 top-1.5 z-10 text-2xl">
                    {isApproved && (
                      <TbCircleCheckFilled className="text-green-500  bg-white rounded-full" />
                    )}
                    {isRejected && (
                      <MdCancel className="text-red-500 bg-white rounded-full" />
                    )}
                    {isPending && (
                      <FaRegCircle className="text-[#999FA9]  bg-white rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="ml-6 mb-6">
                    <motion.div
                      className="flex justify-between items-center flex-wrap gap-2 border border-[#E4E7EC] rounded-[10px] px-[10px] py-3"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src="/assets/avatar.jpeg"
                          alt="avatar"
                          width={30}
                          height={30}
                          className="rounded-full w-10 h-10"
                        />
                        <span className="font-medium">{step.name}</span>
                      </div>
                      <div className="flex flex-col justify-end">
                        <span
                          className={`text-sm font-semibold ${
                            isApproved
                              ? 'text-green-600'
                              : isRejected
                              ? 'text-red-500'
                              : 'text-yellow-500'
                          }`}
                        >
                          {step.status.charAt(0).toUpperCase() +
                            step.status.slice(1)}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {step.date}
                        </p>
                      </div>
                      {/* Rejection comment */}
                      {isRejected && step.comment && (
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
                            {step.comment}
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
