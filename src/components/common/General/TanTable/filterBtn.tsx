import { Button } from '@material-tailwind/react';
import { SlidersHorizontal } from '@phosphor-icons/react';
import React from 'react';

const FilterBtn = ({ func }: { func: () => void }) => {
  const handlePointerEvent = () => {};
  const handleResize = () => {};
  return (
    <div>
      <Button
        onResize={handleResize}
        onResizeCapture={handleResize}
        onPointerEnterCapture={handlePointerEvent}
        onPointerLeaveCapture={handlePointerEvent}
        placeholder=""
        className="flex items-center gap-2 px-4 py-[10px] border-pry text-pry border-[1px] bg-transparent normal-case font-medium"
        onClick={func}
      >
        Filter
        <SlidersHorizontal size={20} />
      </Button>
    </div>
  );
};

export default FilterBtn;
