import { Button } from "@material-tailwind/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface BackBtn {
	backFunc?: () => void;
	hideLabel?: boolean;
	label?: string;
}
const BackBtn = ({ backFunc, hideLabel, label }: BackBtn) => {
	const router = useRouter();
	 const handlePointerEvent = () => {};
	   const handleResize = () => {};
		return (
		<Button
		  onResize={handleResize}
		  onResizeCapture={handleResize}
		  onPointerEnterCapture={handlePointerEvent}
		  onPointerLeaveCapture={handlePointerEvent}
		  placeholder=""
			className='flex items-center gap-2 p-0 normal-case opacity-60 font-normal'
			variant='text'
			onClick={backFunc ? backFunc : () => router.back()}
		>
			<ChevronLeft size={20} />
			{!hideLabel && <h2>{label ? label : "Back"} </h2>}
		</Button>
	);
};

export default BackBtn;
