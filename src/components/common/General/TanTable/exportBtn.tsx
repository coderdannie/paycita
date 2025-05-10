import { Button } from "@material-tailwind/react";
import React from "react";
import exportImg from "@/assets/images/export.png";
import Image from "next/image";
import { Plus } from "lucide-react";

const ExportBtn = ({ label, func }: { label?: string; func?: () => void }) => {
  return (
    <Button
      className="flex items-center gap-2 px-4 pr-3 bg-pry normal-case font-medium py-2 "
      onClick={func}
    >
      <Plus />
      <p className="md:text-sm font-medium">{label}</p>
    </Button>
  );
};

export default ExportBtn;
