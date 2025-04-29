"use client";

import { walletCounts } from "@/src/components/common/constants";
import TableLayer from "@/src/components/data/Wallet/TableLayer";
import { RequestFundModal } from "@/src/components/modals/RequestFundModal";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  useGetWalletHistory,
  useRequestFunds,
} from "@/src/hooks/wallet/useWallet";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";


const WalletPage = () => {
  const { wallet, isLoading } = useGetWalletHistory();

  const [open, setOpen] = useState(false);

  const { mutate: mutateRequestFund, isPending } = useRequestFunds();

  const handleSubmit = (data: { amount: string; reason: string }) => {
    console.log("Submitted data:", data);
    mutateRequestFund(data, {
      onSuccess: (res) => {
        toast.success(res.data.message || "Fund requested successfully!");
        setOpen(false);
      },
      onError: (error) => {
        console.error("Error requesting fund:", error);
        if (error instanceof AxiosError) {
          toast.error(
            error?.response?.data?.message || "Something went wrong!"
          );
        } else {
          toast.error("An unexpected error occurred.");
        }
      },
    });
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl mb-10">
          Wallet
        </h2>
        <Button onClick={() => setOpen(true)}>Request for Fund</Button>
      </div>
      <div className="grid md:grid-cols-3 mt-5 gap-6 w-full">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="min-h-[140px]" />
          ))
        ) : (
          <>
            {walletCounts(wallet?.department).map((data, i) => (
              <div
                key={i}
                className="bg-[#FCFCFC] min-h-[140px]  rounded-[8px] border border-[#E4E7EC] py-6 px-[22px] grid "
              >
                <h4 className="text-[#808191] text-sm">{data?.title}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-[#11142D] text-2xl font-bold">
                    ₦{Number(data?.amount)?.toLocaleString() || "0.00"}
                  </p>
                  {/* <div>
                    <div className="flex items-center border border-[#3440544D] rounded-lg p-[5px] gap-1">
                      <GoArrowUpRight color="green" />{" "}
                      <span className="text-sm">3.46%</span>
                    </div>
                  </div> */}
                </div>
                {/* <p className="text-sm text-[#808191] pt-2">
                  Vs last month: ₦200,000
                </p> */}
              </div>
            ))}
          </>
        )}
      </div>
      <TableLayer walletHistory={wallet.wallet_history} />
      <RequestFundModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
};
export default WalletPage;
