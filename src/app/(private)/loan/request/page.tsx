'use client';

import {
  CustomFormField,
  CustomFormSelect,
} from '@/src/components/common/CustomInput';
import {
  loanApplicationSchema,
  LoanApplicationSchemaType,
} from '@/src/utils/validations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/src/components/ui/textarea';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const REPAYMENT_PERIOD = ['3 Months', '4 Months'] as string[];

const LoanRequest = () => {
  const router = useRouter();
  const form = useForm<LoanApplicationSchemaType>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanAmount: '',
      repaymentPeriod: '',
      loanPurpose: '',
      agreeToTerms: true,
    },
    mode: 'onBlur',
  });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = form;

  const onSubmit = (values: LoanApplicationSchemaType) => {
    console.log(values); // Handle your form submission here
    router.back();
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
              <CustomFormField
                name="loanAmount"
                control={control}
                label="Loan Amount"
                placeholder="Enter Amount"
                error={errors.loanAmount?.message}
              />
              <CustomFormSelect
                name="repaymentPeriod"
                control={control}
                items={REPAYMENT_PERIOD}
                labelText="Repayment Period"
                holder="Select repayment period"
                error={errors.repaymentPeriod?.message}
              />

              <FormField
                control={control}
                name="loanPurpose"
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
                      {errors.loanPurpose?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Checkbox for Terms and Conditions */}
              <div className="flex justify-between items-center">
                <FormField
                  control={control}
                  name="agreeToTerms"
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
                        {errors.agreeToTerms?.message}
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
              className="grid disabled:bg-gray-400 ml-auto"
              disabled={!isValid}
            >
              Request
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoanRequest;
