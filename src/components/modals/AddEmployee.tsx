import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FaUserGroup } from 'react-icons/fa6';

interface AddEmployeeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndividualOnboarding?: () => void;
  onBulkOnboarding?: () => void;
}

export function AddEmployee({
  open,
  onOpenChange,
  onIndividualOnboarding,
  onBulkOnboarding,
}: AddEmployeeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-primary">
            <FaUserGroup size={26} />
          </div>
          <DialogTitle className="text-xl text-center font-semibold text-gray-900">
            How did you want to add your employee?
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          <Button
            variant="outline"
            className="h-12 justify-center border-primary text-primary font-medium hover:bg-purple-50"
            onClick={() => {
              onIndividualOnboarding?.();
              onOpenChange(false);
            }}
          >
            Individually Onboarding
          </Button>

          <Button
            className="h-12 justify-center hover:bg-purple-700"
            onClick={() => {
              onBulkOnboarding?.();
              onOpenChange(false);
            }}
          >
            Bulk Onboarding
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
