import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { PiWarningCircleFill } from 'react-icons/pi';
import { Button } from '../ui/button';

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  title,
  description,
  onCancel,
  onDelete,
  isDeleting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden px-2">
        <div className="text-center py-6 ">
          <PiWarningCircleFill
            className="text-[#EA3D3D] mx-auto text-center mb-4"
            size={46}
          />
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-4">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed px-4">
            {description}
          </DialogDescription>
        </div>

        <div className="flex w-full  px-2 pt-2 mb-8 gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 py-2 border-[#EA3D3D] text-red-600 font-medium hover:bg-gray-50 transition-colors border-r"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            className="flex-1 py-2  bg-[#EA3D3D] text-white font-medium hover:bg-red-700 transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
