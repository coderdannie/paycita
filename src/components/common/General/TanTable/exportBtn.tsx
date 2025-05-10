import { Button } from "@material-tailwind/react";
import React from "react";
import { Plus } from "lucide-react";

const ExportBtn = ({ label, func }: { label?: string; func?: () => void }) => {
   const handlePointerEvent = () => {};
   const handleResize = () => {};
  return (
    <Button
      // Using `any` here can be a quick fix
      className="flex items-center gap-2 px-4 pr-3 bg-pry normal-case font-medium py-2 "
      onClick={func}
      onResize={handleResize}
      onResizeCapture={handleResize}
      onPointerEnterCapture={handlePointerEvent}
      onPointerLeaveCapture={handlePointerEvent}
      placeholder=""
    >
      <Plus />
      <p className="md:text-sm font-medium">{label}</p>
    </Button>
  );
};

export default ExportBtn;
