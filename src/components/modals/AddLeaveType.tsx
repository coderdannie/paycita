import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";

interface AddLeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveTypeName: string;
  onLeaveTypeNameChange: (name: string) => void;
  onSave?: () => void;
  isEdit?: boolean;
  isPending?: boolean;
}

export const AddLeaveTypeDialog: React.FC<AddLeaveTypeDialogProps> = ({
  open,
  onOpenChange,
  leaveTypeName,
  onLeaveTypeNameChange,
  onSave,
  isEdit = false,
  isPending,
}) => {
  const handleSave = () => {
    if (leaveTypeName.trim()) {
      onSave?.();
    }
  };

  const handleClose = () => {
    onLeaveTypeNameChange("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Add New Leave Type
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="leave-type-name" className="text-sm font-medium">
              Leave Type Name
            </Label>
            <input
              id="leave-type-name"
              placeholder="Enter leave type name"
              value={leaveTypeName}
              onChange={(e) => onLeaveTypeNameChange(e.target.value)}
              className="w-full h-12 border-2 border-primary px-1 ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full py-6 rounded-md"
            disabled={!leaveTypeName.trim() || isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
