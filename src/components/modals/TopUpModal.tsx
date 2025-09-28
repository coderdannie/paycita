"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
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
  useGetElectricityProviders,
  useValidateElectricityNumber,
  useBuyElectricity,
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

interface ElectricityValidationDetails {
  customer_name?: string;
  customerName?: string;
  address?: string;
  account_number?: string;
  minimum_amount?: number;
  outstanding_balance?: number | null;
  debt_amount?: number | null;
  minimum_debt?: number | null;
}

type ElectricityValidationResponseData = {
  success?: boolean;
  message?: string;
  data?:
    | ElectricityValidationDetails[]
    | Record<string, ElectricityValidationDetails>
    | null;
};

type ElectricityPurchaseResponseData = {
  message?: string;
  token?: string;
  data?: {
    token?: string;
  };
};

const TopUpModal: React.FC<TopupModalProps> = ({ isOpen, onClose }) => {
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const { mutate: mutateBuyAirtime, isPending: isBuyingAirtime } =
    useBuyAirtime();
  const { mutate: mutateBuyData, isPending: isBuyingData } = useBuyData();

  const [topupType, setTopupType] = useState<
    "airtime" | "data" | "electricity"
  >("airtime");
  const [electricityStep, setElectricityStep] = useState<
    "provider" | "amount" | "success"
  >("provider");
  const [meterOwner, setMeterOwner] = useState<string>("");
  const [electricityToken, setElectricityToken] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationDetails, setValidationDetails] =
    useState<ElectricityValidationDetails | null>(null);
  const [isMeterValidated, setIsMeterValidated] = useState(false);
  const {
    providers,
    isLoading: isFetchingProviders,
    isError: isProvidersError,
  } = useGetElectricityProviders();
  const { mutate: mutateValidateElectricity, isPending: isValidatingMeter } =
    useValidateElectricityNumber();
  const { mutate: mutateBuyElectricity, isPending: isBuyingElectricity } =
    useBuyElectricity();
  const form = useForm<TopupSchemaType & { network_id?: string }>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      network: "",
      phone: "",
      amount: "",
      dataPlan: "",
      network_id: "",
      topupType: "airtime",
      electricityProvider: "",
      meterNumber: "",
      electricityAmount: "",
      meterType: "",
    },
    mode: "onChange",
  });

  const { control, formState, setValue, resetField, watch } = form;

  const watchNetwork =
    topupType === "airtime" ? "" : watch("network")?.toLowerCase() || "";

  const { networkDataPlans } = useGetNetworkDataPlans(watchNetwork);

  const meterNumber = watch("meterNumber");
  const electricityProvider = watch("electricityProvider");
  const meterType = watch("meterType");
  const electricityAmount = watch("electricityAmount");

  const providerOptions = useMemo(
    () =>
      (providers || []).map((provider) => ({
        value: provider.code,
        label: provider.name || provider.code,
      })),
    [providers]
  );

  const selectedProvider = useMemo(
    () =>
      providerOptions.find((option) => option.value === electricityProvider) ||
      null,
    [providerOptions, electricityProvider]
  );

  const isProcessingElectricity = isValidatingMeter || isBuyingElectricity;

  const shouldShowValidationSection =
    topupType === "electricity" &&
    electricityStep === "provider" &&
    (!!meterNumber ||
      !!validationError ||
      isMeterValidated ||
      !!validationDetails);

  const deriveValidationMessage = (message?: string) => {
    if (!message) return "Validation failed";
    const normalized = message.toLowerCase();
    if (normalized.includes("invalid")) {
      return "The meter number you entered appears to be invalid.";
    }
    if (normalized.includes("not found")) {
      return "We couldn't find this meter number. Please confirm and try again.";
    }
    if (normalized.includes("required")) {
      return "Please provide all required meter details.";
    }
    return message;
  };

  // Handle topup type change
  const handleTopupTypeChange = (type: "airtime" | "data" | "electricity") => {
    setTopupType(type);
    setValue("topupType", type);
    setElectricityStep("provider");
    setMeterOwner("");
    setElectricityToken("");
    setValidationError(null);
    setValidationDetails(null);
    setIsMeterValidated(false);

    resetField("electricityProvider");
    resetField("meterNumber");
    resetField("electricityAmount");
    resetField("meterType");

    if (type === "airtime") {
      resetField("dataPlan");
    } else if (type === "data") {
      resetField("amount");
    } else {
      resetField("dataPlan");
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
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            {/* Modal Header */}
            <div className="flex justify-end mb-10">
              <button onClick={onClose}>
                <IoMdClose className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="bg-[#F0EAF5] rounded-md text-[#3A1957] border-2 border-[#D1BEE1] p-4">
              <h2 className="text-sm">
                Top up staff airtime and internet subscriptions, and
                conveniently pay electricity bills.
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
                  alt="data icon"
                  className="w-[25px] sm:w-[40px]"
                  width={100}
                  height={100}
                />
                <span>Data</span>
              </button>
              <button
                className={`px-4 w-full font-medium gap-2 sm:gap-4 border-2 flex items-center py-2 rounded-md ${
                  topupType === "electricity"
                    ? "border-primary text-primary"
                    : "border-[#E5E5E5]"
                }`}
                onClick={() => handleTopupTypeChange("electricity")}
                type="button"
              >
                <Image
                  src="/assets/electricity.svg"
                  alt="electricity icon"
                  className="w-[25px] sm:w-[40px]"
                  width={100}
                  height={100}
                />
                <span>Electricity</span>
              </button>
            </div>

            {/* Form Section */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" grid gap-5"
              >
                {topupType !== "electricity" && (
                  <>
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
                  </>
                )}

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

                {topupType === "electricity" &&
                  electricityStep === "provider" && (
                    <>
                      <CustomFormSelect
                        name="electricityProvider"
                        control={control}
                        items={providerOptions}
                        labelText="Electricity Provider"
                        holder={
                          isFetchingProviders
                            ? "Loading providers..."
                            : "Select your electricity provider"
                        }
                        error={errors.electricityProvider?.message}
                        onChange={() => {
                          setMeterOwner("");
                          setElectricityToken("");
                          setValidationError(null);
                          setValidationDetails(null);
                          setIsMeterValidated(false);
                        }}
                      />

                      {!isFetchingProviders && isProvidersError && (
                        <p className="text-sm text-red-500">
                          Unable to load electricity providers. Please try again
                          later.
                        </p>
                      )}

                      <CustomFormSelect
                        name="meterType"
                        control={control}
                        items={[
                          { label: "Prepaid", value: "prepaid" },
                          { label: "Postpaid", value: "postpaid" },
                        ]}
                        labelText="Meter Type"
                        holder="Select meter type"
                        error={errors.meterType?.message}
                        onChange={() => {
                          setValidationError(null);
                          setValidationDetails(null);
                          setIsMeterValidated(false);
                        }}
                      />

                      <CustomFormField
                        label="Meter Number"
                        name="meterNumber"
                        control={control}
                        placeholder="Enter your meter number"
                        error={errors.meterNumber?.message}
                        onChange={() => {
                          setValidationError(null);
                          setValidationDetails(null);
                          setIsMeterValidated(false);
                          setMeterOwner("");
                        }}
                      />

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            const providerCode = form.getValues(
                              "electricityProvider"
                            );
                            const meterNumberValue =
                              form.getValues("meterNumber");
                            const meterTypeValue = form.getValues("meterType");
                            const amountValue =
                              form.getValues("electricityAmount") || "1000";

                            setValidationError(null);

                            if (!providerCode) {
                              toast.error(
                                "Please select an electricity provider"
                              );
                              return;
                            }

                            if (!meterTypeValue) {
                              toast.error("Please choose your meter type");
                              return;
                            }

                            if (
                              !meterNumberValue ||
                              meterNumberValue.length < 10
                            ) {
                              toast.error(
                                "Please enter a valid meter number (at least 10 digits)"
                              );
                              return;
                            }

                            mutateValidateElectricity(
                              {
                                meter_number: meterNumberValue,
                                meter_type: meterTypeValue,
                                amount: amountValue,
                                service_provider_code: providerCode,
                              },
                              {
                                onSuccess: (res) => {
                                  const payload =
                                    (res?.data as
                                      | ElectricityValidationResponseData
                                      | undefined) ?? {};
                                  if (payload.success === false) {
                                    const msg = deriveValidationMessage(
                                      payload.message
                                    );
                                    setValidationError(msg);
                                    setValidationDetails(null);
                                    setIsMeterValidated(false);
                                    setMeterOwner("");
                                    return;
                                  }

                                  let details: ElectricityValidationDetails | null =
                                    null;
                                  if (Array.isArray(payload.data)) {
                                    details = payload.data[0] ?? null;
                                  } else if (
                                    payload.data &&
                                    typeof payload.data === "object"
                                  ) {
                                    const firstKey = Object.keys(
                                      payload.data
                                    )[0];
                                    details = firstKey
                                      ? (
                                          payload.data as Record<
                                            string,
                                            ElectricityValidationDetails
                                          >
                                        )[firstKey]
                                      : null;
                                  }

                                  const customerName =
                                    details?.customer_name ||
                                    details?.customerName ||
                                    "";

                                  setMeterOwner(customerName);
                                  setValidationDetails(details);
                                  setValidationError(null);
                                  setIsMeterValidated(true);

                                  if (details?.minimum_amount) {
                                    setValue(
                                      "electricityAmount",
                                      String(details.minimum_amount)
                                    );
                                  }
                                },
                                onError: (err) => {
                                  const apiMessage = deriveValidationMessage(
                                    err instanceof AxiosError
                                      ? err.response?.data?.message ||
                                          err.message
                                      : (err as Error)?.message
                                  );
                                  setValidationError(apiMessage);
                                  setValidationDetails(null);
                                  setIsMeterValidated(false);
                                  setMeterOwner("");
                                },
                              }
                            );
                          }}
                          disabled={
                            isValidatingMeter ||
                            !electricityProvider ||
                            !meterType ||
                            !meterNumber ||
                            meterNumber.length < 10
                          }
                          className="px-4 py-2 bg-primary text-white rounded-md text-sm disabled:opacity-60"
                        >
                          {isValidatingMeter ? "Validating..." : "Validate"}
                        </button>
                        {isMeterValidated && !validationError && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                            Validated
                          </span>
                        )}
                      </div>
                    </>
                  )}

                {shouldShowValidationSection && (
                  <div className="space-y-3">
                    {meterOwner && (
                      <div className="flex items-center gap-2">
                        <p className="text-primary font-medium text-sm sm:text-base">
                          Meter Owner: {meterOwner}
                        </p>
                        {isMeterValidated && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                            Validated
                          </span>
                        )}
                      </div>
                    )}

                    {validationError && (
                      <p className="text-red-600 text-sm">{validationError}</p>
                    )}

                    {validationDetails && (
                      <div className="border border-gray-200 rounded-md p-3 text-sm text-gray-700 space-y-2 bg-gray-50">
                        {validationDetails.address && (
                          <div className="flex justify-between gap-4">
                            <span className="font-medium">Address:</span>
                            <span className="text-right max-w-[60%]">
                              {validationDetails.address}
                            </span>
                          </div>
                        )}
                        {validationDetails.account_number && (
                          <div className="flex justify-between gap-4">
                            <span className="font-medium">Account No:</span>
                            <span>{validationDetails.account_number}</span>
                          </div>
                        )}
                        {typeof validationDetails.minimum_amount !==
                          "undefined" && (
                          <div className="flex justify-between gap-4">
                            <span className="font-medium">Minimum Amount:</span>
                            <span>₦{validationDetails.minimum_amount}</span>
                          </div>
                        )}
                        {typeof validationDetails.outstanding_balance !==
                          "undefined" &&
                          validationDetails.outstanding_balance !== null && (
                            <div className="flex justify-between gap-4">
                              <span className="font-medium">
                                Outstanding Balance:
                              </span>
                              <span>
                                ₦{validationDetails.outstanding_balance}
                              </span>
                            </div>
                          )}
                        {typeof validationDetails.debt_amount !== "undefined" &&
                          validationDetails.debt_amount !== null && (
                            <div className="flex justify-between gap-4">
                              <span className="font-medium">Debt Amount:</span>
                              <span>₦{validationDetails.debt_amount}</span>
                            </div>
                          )}
                        {typeof validationDetails.minimum_debt !==
                          "undefined" &&
                          validationDetails.minimum_debt !== null && (
                            <div className="flex justify-between gap-4">
                              <span className="font-medium">Minimum Debt:</span>
                              <span>₦{validationDetails.minimum_debt}</span>
                            </div>
                          )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (!isMeterValidated) return;
                        setElectricityStep("amount");
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50"
                      disabled={!isMeterValidated}
                    >
                      Continue
                    </button>
                  </div>
                )}

                {topupType === "electricity" &&
                  electricityStep === "amount" && (
                    <>
                      <CustomFormField
                        label="Amount"
                        name="electricityAmount"
                        control={control}
                        placeholder="Enter the amount you want to recharge"
                        error={errors.electricityAmount?.message}
                      />

                      {meterOwner && (
                        <div className="text-sm text-primary font-medium mt-2">
                          Meter Owner: {meterOwner}
                        </div>
                      )}
                    </>
                  )}

                {topupType === "electricity" &&
                  electricityStep === "success" && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-[#1D2939] mb-2">
                        Electricity payment
                      </h3>
                      <h3 className="text-xl font-semibold text-[#1D2939] mb-4">
                        successful!
                      </h3>
                      {selectedProvider?.label && (
                        <p className="text-sm text-[#1D2939] mb-2">
                          Provider:{" "}
                          <span className="font-bold">
                            {selectedProvider.label}
                          </span>
                        </p>
                      )}
                      {meterOwner && (
                        <p className="text-sm text-[#1D2939] mb-2">
                          Meter Owner:{" "}
                          <span className="font-bold">{meterOwner}</span>
                        </p>
                      )}
                      {electricityAmount && (
                        <p className="text-sm text-[#1D2939] mb-4">
                          Amount Paid:{" "}
                          <span className="font-bold">
                            ₦{electricityAmount}
                          </span>
                        </p>
                      )}
                      <p className="text-sm text-[#1D2939] mb-6">
                        Your{" "}
                        <span className="font-bold">{electricityToken}</span>.
                        Enter this on your meter to restore power.
                      </p>
                    </div>
                  )}

                {/* Action Buttons */}
                {topupType === "electricity" &&
                electricityStep === "success" ? (
                  <button
                    type="button"
                    className="w-full bg-primary text-white rounded-md py-2 mt-4"
                    onClick={() => {
                      setElectricityStep("provider");
                      setMeterOwner("");
                      setElectricityToken("");
                      setValidationError(null);
                      setValidationDetails(null);
                      setIsMeterValidated(false);
                      onClose();
                    }}
                  >
                    Go Back to Home Page
                  </button>
                ) : topupType === "electricity" &&
                  electricityStep === "amount" ? (
                  <button
                    type="button"
                    className="w-full bg-primary text-white rounded-md py-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isProcessingElectricity || !isMeterValidated}
                    onClick={() => {
                      if (isProcessingElectricity) {
                        return;
                      }

                      if (!isMeterValidated) {
                        toast.error(
                          "Please validate the meter before continuing"
                        );
                        return;
                      }

                      const amountValue = form.getValues("electricityAmount");
                      const providerCode = electricityProvider;
                      const meterTypeValue = meterType;

                      if (!providerCode) {
                        toast.error("Please select an electricity provider");
                        return;
                      }

                      if (!meterTypeValue) {
                        toast.error("Please choose your meter type");
                        return;
                      }

                      if (!meterNumber || meterNumber.length < 10) {
                        toast.error(
                          "Please enter a valid meter number (at least 10 digits)"
                        );
                        return;
                      }

                      if (!amountValue || Number(amountValue) <= 0) {
                        toast.error("Please enter a valid amount");
                        return;
                      }

                      setElectricityToken("");

                      mutateBuyElectricity(
                        {
                          meter_number: meterNumber,
                          meter_type: meterTypeValue,
                          amount: amountValue,
                          service_provider_code: providerCode,
                          customer_name:
                            meterOwner ||
                            validationDetails?.customer_name ||
                            validationDetails?.customerName ||
                            "Electricity customer",
                        },
                        {
                          onSuccess: (purchaseResponse) => {
                            const purchaseData =
                              (purchaseResponse?.data as
                                | ElectricityPurchaseResponseData
                                | undefined) ?? {};
                            const token =
                              purchaseData?.token ||
                              purchaseData?.data?.token ||
                              "";

                            setElectricityToken(
                              token ||
                                "Token will be shared shortly. Kindly check your notifications."
                            );

                            toast.success(
                              purchaseData?.message ||
                                "Electricity payment successful"
                            );
                            setElectricityStep("success");
                          },
                          onError: (error) => {
                            if (error instanceof AxiosError) {
                              toast.error(
                                error?.response?.data?.message ||
                                  "Failed to complete electricity purchase"
                              );
                            } else {
                              toast.error(
                                "Failed to complete electricity purchase"
                              );
                            }
                          },
                        }
                      );
                    }}
                  >
                    {isProcessingElectricity ? "Processing..." : "Pay"}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-primary text-white rounded-md py-2 mt-4"
                    disabled={isBuyingAirtime || isBuyingData}
                  >
                    {isBuyingAirtime || isBuyingData
                      ? "Processing..."
                      : "Confirm"}
                  </button>
                )}
              </form>
            </Form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopUpModal;
