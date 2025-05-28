import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { SlidersHorizontal } from "@phosphor-icons/react";

interface FilterBtnProps {
  func: () => void;
  opt?: string[]; // Filter options
  selected?: string; // Currently selected option
  onSelect?: (value: string) => void; // Callback when an option is selected
}

const FilterBtn: React.FC<FilterBtnProps> = ({
  func,
  opt,
  onSelect,
  selected,
}) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelect = (value: string) => {
    setOpen(false);
    onSelect?.(value);
  };

  const handlePointerEvent = () => {};
  const handleResize = () => {};

  return (
    <div className="relative">
      <Button
        onResize={handleResize}
        onResizeCapture={handleResize}
        onPointerEnterCapture={handlePointerEvent}
        onPointerLeaveCapture={handlePointerEvent}
        placeholder=""
        onClick={() => {
          toggleDropdown();
          func();
        }}
        className="flex items-center gap-2 px-4 py-[10px] border-primary text-primary border-[1px] bg-transparent normal-case font-medium shadow-none"
      >
        Filter {selected && `: ${selected}`}
        <SlidersHorizontal size={20} />
      </Button>

      {open && opt?.length && (
        <ul className="absolute mt-2 z-10 bg-white border border-gray-200 rounded shadow-md w-40">
          {opt.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                item === selected
                  ? "font-semibold text-primary"
                  : "text-gray-700"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterBtn;
