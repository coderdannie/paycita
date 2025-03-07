import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const Checkout: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="text-center bg-white p-0  w-[90%] rounded-md">
        {/* Modal Header */}
        <DialogHeader className=" py-5 ">
          <DialogTitle className="text-[#1D2939] px-6  text-lg font-semibold ">
            Check out
          </DialogTitle>
          <DialogDescription className="flex flex-wrap justify-center md:justify-start border-y border-[#E4E7EC]  gap-1 items-center text-sm text-gray-[#596066] py-[28px] px-4 ">
            <Image
              src="/assets/warning.svg"
              alt="warning icon"
              height={100}
              width={100}
              className="w-6 h-6"
            />
            Your total working time today is
            <span className="font-semibold"> 08:00:05 Hrs</span>
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
            <button className="bg-primary h-[40px] rounded-lg text-white flex-1">
              Clock out
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
