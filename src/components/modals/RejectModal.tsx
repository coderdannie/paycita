'use client';

import { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { Textarea } from '../ui/textarea';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (comment: string) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onReject,
}) => {
  const [comment, setComment] = useState('');

  const closeModal = useCallback(() => {
    setComment('');
    onClose();
  }, [onClose]);

  const handleReject = () => {
    onReject(comment);
    closeModal();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <IoMdClose size={22} />
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">
              Are you sure you want to <br /> reject this request?
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add rejection comment (optional)
              </label>
              <Textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Provide the reason why you are rejecting this request"
                className="w-full px-3 py-2 text-white border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex justify-between gap-4">
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90 h-10"
                onClick={handleReject}
              >
                Yes I’m sure
              </Button>
              <Button
                variant="outline"
                className="w-full border-primary text-primary h-10"
                onClick={closeModal}
              >
                No, I’m not
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RejectModal;
