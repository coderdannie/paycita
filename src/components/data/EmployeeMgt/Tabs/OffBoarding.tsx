"use client";
import OffBoardingDrawer from "@/src/components/modals/OffBoardingDrawer";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useOffBoardEmployee } from "@/src/api/hooks/dashboard/useDashboard";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

const OffBoarding = ({
  itemsGiven,
  status,
}: {
  itemsGiven: string[];
  status: string;
}) => {
  const { id } = useParams();
  const router = useRouter();
  const employeeId = id as string;
  const [isOpen, setIsOpen] = useState(false);
  const { offBoardEmployee, isPending } = useOffBoardEmployee();

  const handleOffBoard = (selectedItems: string[]) => {
    console.log("Items to be returned:", selectedItems);
    offBoardEmployee(
      {
        items: selectedItems,
        employee_id: employeeId,
      },
      {
        onSuccess: () => {
          toast.success("Employee offboarded successfully");
          setIsOpen(false);
          router.push("/employee-mgt");
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to offboard employee"
          );
        },
      }
    );
  };

  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px] font-semibold text-sm text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
            ${
              status?.toLowerCase() === "active"
                ? "text-green-600 border-[#89D8A9] bg-[#F5FFFA]"
                : "text-red-600 border-[#F49E9E] bg-[#FFF5F5]"
            }`}
      >
        {status?.replace("_", " ")}
      </span>
    ),
    []
  );

  return (
    <div className="bg-white px-5 py-6 border border-[#E4E7EC] rounded-lg">
      <div className="flex justify-between">
        <div>
          <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4">
            <Image
              src="/assets/doc.png"
              alt="Document Preview"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <div>
              <h4 className="text-[#667085] text-sm pb-[6px]">Location</h4>
              <p className="font-semibold">Remote</p>
            </div>
            <div>
              <h4 className="text-[#667085] text-sm pb-[6px]">Job Title</h4>
              <p className="font-semibold">Backend Developer</p>
            </div>
            <div>
              <h4 className="text-[#667085] text-sm pb-[6px]">Status</h4>
              <p className="capitalize">{renderStatusBadge(status)}</p>
            </div>
          </div>
        </div>
        <button
          className="py-[10px] px-4 h-fit text-white text-sm font-semibold bg-[#EA3D3D] rounded-md"
          onClick={() => setIsOpen(true)}
          // disabled={isPending} // Disable button while offboarding is in progress
        >
          {"Off Boarding"}
        </button>
      </div>
      <OffBoardingDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleOffBoard} // Pass the offboarding handler to the drawer
        itemsGiven={itemsGiven}
        isPending={isPending}
        
      />
    </div>
  );
};

export default OffBoarding;
