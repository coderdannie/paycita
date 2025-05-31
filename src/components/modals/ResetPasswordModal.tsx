import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isPending: boolean;
  handleReset: () => void;
};

const ResetPassword: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  isPending,
  handleReset,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="text-center bg-white p-0  w-[90%] rounded-md">
        {/* Modal Header */}
        <DialogHeader className=" py-5 ">
          <DialogTitle className="text-[#1D2939] px-6 text-center  text-lg font-semibold ">
            Reset Password
          </DialogTitle>
          <DialogDescription className=" text-center ">
            Are you sure you want to reset user password?
          </DialogDescription>
        </DialogHeader>

        {/* Modal Footer */}
        <DialogFooter className="px-6 pb-[20px]">
          <div className="flex w-full justify-between gap-4 font-semibold  text-sm ">
            <button
              className="flex-1 h-[40px] rounded-lg border border-[#EA3D3D]  text-[#EA3D3D]"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <Button
              className="flex-1"
              disabled={isPending}
              onClick={handleReset}
            >
              {isPending && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              )}{' '}
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
