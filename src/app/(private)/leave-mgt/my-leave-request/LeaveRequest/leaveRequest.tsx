'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaveRequestButtonProps {
  onOpen: () => void;
}

const LeaveRequestButton: React.FC<LeaveRequestButtonProps> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className={cn(
        'bg-primary hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300',
        'hide-sidebar:w-full sm:hide-sidebar:w-auto'
      )}
    >
      <Plus className="w-5 h-5 mr-2" />
      Leave Request
    </button>
  );
};

export default LeaveRequestButton;
