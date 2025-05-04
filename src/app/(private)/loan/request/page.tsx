"use client";

import {
  CustomFormField,
  CustomFormSelect,
} from "@/src/components/common/CustomInput";
import {
  loanApplicationSchema,
  LoanApplicationSchemaType,
} from "@/src/utils/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetLoanType,
  useGetLoanTypeDetails,
  // useGetRepaymentPeriod,
  useRequestLoan,
} from "@/src/hooks/loan/useLoan";
import { useToast } from "@/src/context/ToastContext";
import { Loan } from "@/src/types/loan";
import { Spinner } from "react-activity";
import { InfoIcon } from "lucide-react";
import LoanTypeDetails from "@/src/components/modals/LoanTypeDetails";
import { useState } from "react";

const LoanRequest = () => {
  const { addToast } = useToast();
  const router = useRouter();

  const [openLoanDetails, setOpenLoanDetails] = useState<boolean>(false);

  // const { repaymentPeriod } = useGetRepaymentPeriod();

  const { mutate: mutateRequestLoan, isPending: isPendingCreateEvent } =
    useRequestLoan();

  const { loanType } = useGetLoanType();

  const form = useForm<LoanApplicationSchemaType>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loan_type: "",
      amount: "",
      // loan_payment_plan: "",
      loan_purpose: "",
      salary_deduction_agreement: true,
    },
    mode: "onBlur",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = form;

  const loanTypeWatch = watch("loan_type");

  const loanTypeID = loanType.find(
    (item: { loan_type: string }) => item.loan_type === loanTypeWatch
  )?.id;

  const { loanTypeDetails } = useGetLoanTypeDetails(loanTypeID);

  const onSubmit = (values: LoanApplicationSchemaType) => {
    mutateRequestLoan(values as Loan, {
      onSuccess: (res) => {
        addToast(res.data.message || "Loan Requested Successfully", "success");
        router.push("/loan");
      },
      onError: (error) => {
        addToast(error.message, "error");
      },
    });
  };

  return (
    <div className="max-w-[500px] w-full mx-auto mt-[60px]">
      <h2 className="text-[#1D2939] font-bold text-lg md:text-xl text-center">
        Requesting a Loan
      </h2>
      <div className="grid gap-2">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
            <div className="grid gap-5 pb-5 mt-5">
              <div>
                <CustomFormSelect
                  name="loan_type"
                  control={control}
                  items={loanType.map(
                    (item: { loan_type: string; name: string }) =>
                      item.loan_type
                  )}
                  labelText="Loan Type"
                  holder="Select loan type"
                  error={errors.loan_type?.message}
                />
                {loanTypeDetails && (
                  <button
                    type="button"
                    className="text-gray-500 text-xs flex items-center gap-1 mt-1"
                    onClick={() => {
                      setOpenLoanDetails(true);
                    }}
                  >
                    <InfoIcon className="w-3 h-3" /> Loan Details
                  </button>
                )}
              </div>
              <CustomFormField
                name="amount"
                control={control}
                label="Loan Amount"
                placeholder="Enter Amount"
                error={errors.amount?.message}
              />

              {/* <CustomFormSelect
                name="loan_payment_plan"
                control={control}
                items={repaymentPeriod.map(
                  (item: { name: string }) => item.name
                )}
                labelText="Repayment Period"
                holder="Select repayment period"
                error={errors.loan_payment_plan?.message}
              /> */}

              <FormField
                control={control}
                name="loan_purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize font-semibold text-sm text-[#1D2939]">
                      Loan Purpose
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe the purpose of the loan"
                        className="resize-none bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500">
                      {errors.loan_purpose?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Checkbox for Terms and Conditions */}
              <div className="flex justify-between items-center">
                <FormField
                  control={control}
                  name="salary_deduction_agreement"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 rounded-md pr-2">
                      <FormControl>
                        <Checkbox
                          id="terms1"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="terms1"
                        className="text-sm font-normal"
                      >
                        Salary Deduction Agreement
                      </FormLabel>
                      <FormMessage className="text-red-500">
                        {errors.salary_deduction_agreement?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <a href="#" className="text-blue-500 underline text-sm">
                  View loan policy
                </a>
              </div>
            </div>
            <Button
              type="submit"
              className="flex items-center justify-center gap-3 disabled:bg-gray-400 ml-auto"
              disabled={isPendingCreateEvent}
            >
              {isPendingCreateEvent && <Spinner />} Request
            </Button>
          </form>
        </Form>
      </div>

      <LoanTypeDetails
        isOpen={openLoanDetails && !!loanTypeDetails}
        onClose={() => {
          setOpenLoanDetails(false);
        }}
        details={loanTypeDetails}
      />
    </div>
  );
};

export default LoanRequest;
