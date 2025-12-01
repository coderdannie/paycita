import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { PiWarningCircleFill } from "react-icons/pi";
import { Button } from "../ui/button";

interface ModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onReactivate: () => void;
  isPending: boolean;
}

export const ReactiveEmployee: React.FC<ModalProps> = ({
  isOpen,

  onCancel,
  onReactivate,
  isPending,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden px-2">
        <div className="text-center py-6 ">
          <PiWarningCircleFill
            className="text-primary mx-auto text-center mb-4"
            size={46}
          />
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-4">
            Reactivate this employee?
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed px-4">
            Are you sure you want to reactivate FAVOUR? This will restore their
            access and active status.
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
            onClick={onReactivate}
            className="flex-1 py-2  text-white font-medium transition-colors"
          >
            {isPending ? "Reactiving..." : "Reactivate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
