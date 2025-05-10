import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { logUserOut } from "@/src/Redux/features/authSlice";

// Define the prop types for the ConfirmLogoutModal component
interface ConfirmLogoutModalProps {
  open: boolean;
  handleOpen: () => void;
}

const ConfirmLogoutModal = ({ handleOpen, open }: ConfirmLogoutModalProps) => {
  const dispatch = useDispatch();

  // Create empty handler functions for the required events
  const handlePointerEvent = () => {};
  const handleResize = () => {};

  const logout = async () => {
    dispatch(logUserOut());
  };

  return (
    <Dialog
      open={open}
      size="xs"
      handler={handleOpen}
      onResize={handleResize}
      onResizeCapture={handleResize}
      onPointerEnterCapture={handlePointerEvent}
      onPointerLeaveCapture={handlePointerEvent}
      placeholder="Are you sure you want to logout from the app?"
    >
      <DialogHeader
        className="text-black_pry"
        onResize={handleResize}
        onResizeCapture={handleResize}
        onPointerEnterCapture={handlePointerEvent}
        onPointerLeaveCapture={handlePointerEvent}
        placeholder=""
      >
        Logout
      </DialogHeader>
      <DialogBody
        onResize={handleResize}
        onResizeCapture={handleResize}
        onPointerEnterCapture={handlePointerEvent}
        onPointerLeaveCapture={handlePointerEvent}
        placeholder=""
      >
        Are you sure you want to logout from the app?
      </DialogBody>
      <DialogFooter
        onResize={handleResize}
        onResizeCapture={handleResize}
        onPointerEnterCapture={handlePointerEvent}
        onPointerLeaveCapture={handlePointerEvent}
        placeholder=""
      >
        <Button
          variant="text"
          onClick={handleOpen}
          className="mr-1 normal-case text-black"
          onResize={handleResize}
          onResizeCapture={handleResize}
          onPointerEnterCapture={handlePointerEvent}
          onPointerLeaveCapture={handlePointerEvent}
          placeholder=""
        >
          <span>No, Cancel</span>
        </Button>
        <Button
          onResize={handleResize}
          onResizeCapture={handleResize}
          onPointerEnterCapture={handlePointerEvent}
          onPointerLeaveCapture={handlePointerEvent}
          placeholder=""
          className="normal-case bg-red_pry"
          onClick={logout}
        >
          <span>Yes, Logout</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmLogoutModal;
