'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { Checkbox } from '../ui/checkbox';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RevokeItem {
  label: string;
  value: string;
}

const revokeItemsList: RevokeItem[] = [
  { label: 'Id Card', value: 'idCard' },
  { label: 'Laptop', value: 'laptop' },
  { label: 'Accommodation', value: 'accommodation' },
  { label: 'Phone', value: 'phone' },
];

const OffBoardingDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, value]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleRevoke = () => {
    // onItemsRevoked(selectedItems);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl z-50 rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex px-6 items-center justify-between border-b border-[#E4E7EC] py-5">
              <h2 className="text-lg font-semibold">Off Boarding Employee</h2>
              <button
                onClick={onClose}
                aria-label="Close Off Boarding Employee drawer"
              >
                <IoClose className="text-2xl text-[#667085]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow overflow-y-auto">
              <h3 className="text-md font-semibold mb-4">Revoke Items</h3>
              <div className="space-y-2">
                {revokeItemsList.map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`revoke-${item.value}`}
                      checked={selectedItems.includes(item.value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(item.value, !!checked)
                      }
                    />
                    <label
                      htmlFor={`revoke-${item.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex items-center  absolute bottom-0 mb-10 place-items-center gap-2 right-0 left-0 px-4">
                <button
                  className="border border-[#344054] h-fit py-2 rounded-[8px] px-2 w-[40%] "
                  onClick={onClose}
                >
                  Back
                </button>
                <button
                  onClick={handleRevoke}
                  className="py-2 bg-[#EA3D3D] border border-[#EA3D3D] rounded-[8px] text-sm font-semibold w-[60%] px-1 text-white"
                >
                  Complete Off Boarding
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default OffBoardingDrawer;
