"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { topupSchema, TopupSchemaType } from "@/src/utils/validations";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { CustomFormSelect, CustomFormField } from "../common/CustomInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  useBuyAirtime,
  useBuyData,
  useGetNetworkDataPlans,
} from "@/src/hooks/bill-payment/useBillPayments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TopUpModal: React.FC<TopupModalProps> = ({ isOpen, onClose }) => {
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const { mutate: mutateBuyAirtime, isPending: isBuyingAirtime } =
    useBuyAirtime();
  const { mutate: mutateBuyData, isPending: isBuyingData } = useBuyData();

  const [topupType, setTopupType] = useState<"airtime" | "data">("airtime");
  const form = useForm<TopupSchemaType & { network_id?: string }>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      network: "",
      phone: "",
      amount: "",
      dataPlan: "",
      network_id: "",
      topupType: "airtime",
    },
    mode: "onChange",
  });

  const { control, formState, setValue, resetField, watch } = form;

  const watchNetwork =
    topupType === "airtime" ? "" : watch("network")?.toLowerCase() || "";

  const { networkDataPlans } = useGetNetworkDataPlans(watchNetwork);

  // Handle topup type change
  const handleTopupTypeChange = (type: "airtime" | "data") => {
    setTopupType(type);
    setValue("topupType", type);
    if (type === "airtime") {
      resetField("dataPlan");
    } else {
      resetField("amount");
    }
  };

  const { errors } = formState;

  const onSubmit = (data: TopupSchemaType & { network_id?: string }) => {
    const airtimePayload = {
      network: data.network.toLowerCase(),
      phone_number: data.phone,
      amount: data.amount,
    };

    const dataPayload = {
      network_id: networkId,
      recipient: data.phone,
      plan_id: planId,
    };

    if (topupType === "airtime") {
      mutateBuyAirtime(airtimePayload, {
        onSuccess: () => {
          toast.success("Airtime purchase successful");
          onClose();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(
              error?.response?.data?.message || "Error purchasing airtime"
            );
          }
        },
      });
    } else {
      mutateBuyData(dataPayload, {
        onSuccess: () => {
          toast.success("Data purchase successful");
          onClose();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(
              error?.response?.data?.message || "Error purchasing data"
            );
          }
        },
      });
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg p-6 w-96 mx-4">
            {/* Modal Header */}
            <div className="flex justify-end mb-10">
              <button onClick={onClose}>
                <IoMdClose className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="bg-[#F0EAF5] rounded-md text-[#3A1957] border-2 border-[#D1BEE1] p-4">
              <h2 className="text-sm">
                Topup your staff airtime or internet subscriptions from your
                favorite internet providers
              </h2>
            </div>

            {/* Toggle Buttons */}
            <div className="flex space-x-2 mb-4 mt-6">
              <button
                className={`px-4 w-full font-medium gap-2 sm:gap-4 border-2 flex items-center py-2 rounded-md ${
                  topupType === "airtime"
                    ? "border-primary text-primary"
                    : "border-[#E5E5E5]"
                }`}
                onClick={() => handleTopupTypeChange("airtime")}
                type="button"
              >
                <Image
                  src="/assets/airtime.svg"
                  alt="phone icon"
                  className="w-[25px] sm:w-[40px]"
                  width={100}
                  height={100}
                />
                <span>Airtime</span>
              </button>
              <button
                className={`px-4 w-full font-medium gap-2 sm:gap-4 border-2 flex items-center py-2 rounded-md ${
                  topupType === "data"
                    ? "border-primary text-primary"
                    : "border-[#E5E5E5]"
                }`}
                onClick={() => handleTopupTypeChange("data")}
                type="button"
              >
                <Image
                  src="/assets/data.svg"
                  alt="phone icon"
                  className="w-[25px] sm:w-[40px]"
                  width={100}
                  height={100}
                />
                <span>Data</span>
              </button>
            </div>

            {/* Form Section */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" grid gap-5"
              >
                <CustomFormSelect
                  name="network"
                  control={control}
                  items={["MTN", "Airtel", "Glo", "9mobile"]}
                  labelText="Network Provider"
                  holder="Select Network Provider"
                  error={errors.network?.message}
                />

                <CustomFormField
                  label="Phone Number"
                  name="phone"
                  control={control}
                  placeholder="Enter phone number"
                  error={errors.phone?.message}
                />

                {topupType === "airtime" && (
                  <CustomFormField
                    label="Amount"
                    name="amount"
                    control={control}
                    placeholder="Enter amount"
                    error={errors.amount?.message}
                  />
                )}

                {topupType === "data" && (
                  <>
                    <FormField
                      control={control}
                      name="dataPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize font-semibold text-sm text-[#1D2939]">
                            Data Plan
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const selectedPlan = networkDataPlans?.find(
                                (item: { name: string }) => item.name === value
                              );

                              field.onChange(value);
                              if (selectedPlan) {
                                setNetworkId(selectedPlan.network_id);
                                setPlanId(selectedPlan.id);
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Data Plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {Array.isArray(networkDataPlans) &&
                                networkDataPlans?.map((item) => (
                                  <SelectItem key={item.id} value={item.name}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Confirm Button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-white rounded-md py-2 mt-4"
                  disabled={isBuyingAirtime || isBuyingData}
                >
                  {isBuyingAirtime || isBuyingData
                    ? "Processing..."
                    : "Confirm"}
                </button>
              </form>
            </Form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopUpModal;
