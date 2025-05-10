import { Button, Typography } from "@material-tailwind/react";
import React from "react";

const handlePointerEvent = () => {};
const handleResize = () => {};

const PopoverButton = ({
  icon: Icon,
  label,
  onClick,
  color,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  color?: string;
}) => (
  <Button
    onResize={handleResize}
    onResizeCapture={handleResize}
    onPointerEnterCapture={handlePointerEvent}
    onPointerLeaveCapture={handlePointerEvent}
    placeholder=""
    variant="text"
    className="flex items-center gap-2 cursor-pointer lowercase first-letter:capitalize border-none text-left text-gray_5 dark:text-gray_3"
    onClick={onClick}
    style={{ color: color ? color : "" }}
  >
    <Icon size={20} />
    <Typography
      onResize={handleResize}
      onResizeCapture={handleResize}
      onPointerEnterCapture={handlePointerEvent}
      onPointerLeaveCapture={handlePointerEvent}
      placeholder=""
      className="lowercase first-letter:capitalize"
    >
      {label}
    </Typography>
  </Button>
);

export default PopoverButton;
