import React from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';

interface Benefit {
  id: string;
  benefit_name: string;
  description: string;
  benefit_type: string;
  unit: string;
  allocation: string;
  recurring: string;
}

interface BenefitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName?: string;
  availableBenefits?: Benefit[];
  selectedBenefits?: string[];
  onSelectedBenefitsChange: (selectedBenefits: string[]) => void;
  onAssign: (selectedBenefits: string[]) => void;
  isPending: boolean;
}

export const BenefitsDialog: React.FC<BenefitsDialogProps> = ({
  open,
  onOpenChange,
  employeeName = 'Bola',
  availableBenefits = [],
  selectedBenefits = [],
  onSelectedBenefitsChange,
  onAssign,
  isPending,
}) => {
  const handleBenefitToggle = (benefitId: string) => {
    const isSelected = selectedBenefits.includes(benefitId);
    if (isSelected) {
      onSelectedBenefitsChange(
        selectedBenefits.filter((id) => id !== benefitId)
      );
    } else {
      onSelectedBenefitsChange([...selectedBenefits, benefitId]);
    }
  };

  const handleAssign = () => {
    onAssign(selectedBenefits);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center ">
            <DialogTitle>Assign Benefits to {employeeName}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-6">
            Select one or more benefits to assign:
          </p>
          <div className="space-y-4">
            {availableBenefits.map((benefit) => (
              <div key={benefit.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleBenefitToggle(benefit.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                      selectedBenefits.includes(benefit.id)
                        ? 'bg-primary border-primary text-white'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {selectedBenefits.includes(benefit.id) && (
                      <Check className="h-3 w-3" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {benefit.benefit_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {benefit.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Type: {benefit.benefit_type}</span>
                      <span>Allocation: {benefit.allocation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleAssign}
              disabled={selectedBenefits.length === 0}
              className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${
                selectedBenefits.length > 0
                  ? 'bg-primary hover:bg-purple-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isPending
                ? 'Assigning...'
                : ` ASSIGN (${selectedBenefits.length}) `}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
