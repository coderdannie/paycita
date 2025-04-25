// components/CommentModal.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsArrow90DegRight } from 'react-icons/bs';
import { Button } from '../ui/button';
import { FaPaperPlane } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Image from 'next/image';

interface Comment {
  name: string;
  text: string;
  time: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onSend: (message: string) => void;
  setIsShow: (param: boolean) => void;
}

export default function CommentModal({
  isOpen,
  onClose,
  comments,
  onSend,
  setIsShow,
}: CommentModalProps) {
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="flex pb-2 justify-between items-center mb-4 border-b border-[#E7E7ED]">
              <h2 className="text-lg font-semibold text-[#344054]">
                Comment Thread
              </h2>
              <button
                onClick={() => {
                  setIsShow(true);
                  onClose();
                }}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {comments.map((c, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/avatar.jpeg"
                      alt="avatar"
                      width={30}
                      height={30}
                      className="rounded-full w-10 h-10"
                    />{' '}
                    <p className="text-sm font-medium text-gray-700">
                      {c.name}{' '}
                      <span className="text-xs text-gray-400">{c.time}</span>
                    </p>
                  </div>

                  <p className="text-sm text-gray-600">{c.text}</p>
                  <div className="text-xs flex items-center gap-2  mt-1">
                    <BsArrow90DegRight />

                    <span className="text-[#8991A0]"> Reply</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center border rounded-md px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your comment here"
                className="flex-1 outline-none text-sm"
              />
              <Button onClick={handleSend} className=" p-2 ml-2">
                <FaPaperPlane />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
