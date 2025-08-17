'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Form } from '@/src/components/ui/form';
import {
  CustomFormField,
  CustomFormSelect,
} from '@/src/components/common/CustomInput';

interface Benefit {
  id: string;
  benefit_name: string;
  description: string;
  benefit_type: string;
  unit: string;
  allocation: string;
  recurring: string;
}

interface AddBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BenefitFormData) => void;
  isEditMode?: boolean;
  editingBenefit?: Benefit | null;
  isAdding: boolean;
}

interface BenefitFormData {
  benefit_name: string;
  description: string;
  benefit_type: string;
  unit: string;
  allocation: string;
  recurring: string;
}

const benefitNameOptions = [
  { value: 'paid_leave', label: 'Paid Leave' },
  { value: 'maternity_grant', label: 'Maternity Grant' },
  { value: 'meal_voucher', label: 'Meal Voucher' },
  { value: 'transport_voucher', label: 'Transport Voucher' },
  { value: 'health_insurance', label: 'Health Insurance' },
];

const benefitTypeOptions = [
  { value: 'leave', label: 'Leave' },
  { value: 'monetary_allowance', label: 'Monetary Allowance' },
  { value: 'meal_voucher', label: 'Meal Voucher' },
  { value: 'transportation_voucher', label: 'Transportation Voucher' },
  { value: 'insurance', label: 'Insurance' },
];

const unitOptions = [
  { value: 'days', label: 'Days' },
  { value: 'amount', label: 'Amount' },
  { value: 'vouchers', label: 'Vouchers' },
  { value: 'policy', label: 'Policy' },
];

const renewalCycleOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'none', label: 'None' },
];

// Helper functions to convert between API values and form values
const mapApiToFormValue = (
  apiValue: string,
  options: Array<{ value: string; label: string }>
) => {
  // First try exact match with value
  const exactMatch = options.find((option) => option.value === apiValue);
  if (exactMatch) return exactMatch.value;

  // Then try case-insensitive match with label
  const labelMatch = options.find(
    (option) => option.label.toLowerCase() === apiValue.toLowerCase()
  );
  if (labelMatch) return labelMatch.value;

  // Finally try case-insensitive match with value
  const valueMatch = options.find(
    (option) => option.value.toLowerCase() === apiValue.toLowerCase()
  );
  if (valueMatch) return valueMatch.value;

  return '';
};

const AddBenefitModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode = false,
  editingBenefit = null,
  isAdding,
}: AddBenefitModalProps) => {
  const form = useForm<BenefitFormData>({
    defaultValues: {
      benefit_name: '',
      description: '',
      benefit_type: '',
      unit: '',
      allocation: '',
      recurring: '',
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = form;
  const watchedBenefitType = watch('benefit_type');

  // Watch all form fields for validation
  const watchedValues = watch();

  // Check if all fields are filled
  const isFormValid = Object.values(watchedValues).every(
    (value) => value !== '' && value !== null && value !== undefined
  );

  console.log('edit', editingBenefit);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editingBenefit) {
      setValue(
        'benefit_name',
        mapApiToFormValue(editingBenefit.benefit_name, benefitNameOptions)
      );
      setValue('description', editingBenefit.description);
      setValue(
        'benefit_type',
        mapApiToFormValue(editingBenefit.benefit_type, benefitTypeOptions)
      );
      setValue('unit', mapApiToFormValue(editingBenefit.unit, unitOptions));
      setValue('allocation', editingBenefit.allocation);
      setValue(
        'recurring',
        mapApiToFormValue(editingBenefit.recurring, renewalCycleOptions)
      );
    } else {
      reset();
    }
  }, [isEditMode, editingBenefit, setValue, reset]);

  // Auto-change unit based on benefit type using useEffect
  useEffect(() => {
    if (!isEditMode && watchedBenefitType) {
      switch (watchedBenefitType) {
        case 'leave':
          setValue('unit', 'days');
          break;
        case 'monetary_allowance':
          setValue('unit', 'amount');
          break;
        case 'meal_voucher':
        case 'transportation_voucher':
          setValue('unit', 'vouchers');
          break;
        case 'insurance':
          setValue('unit', 'policy');
          break;
        default:
          setValue('unit', '');
      }
    }
  }, [watchedBenefitType, isEditMode, setValue]);

  const handleFormSubmit = (data: BenefitFormData) => {
    onSubmit?.(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-[#1D2939]">
            {isEditMode ? 'Edit Benefit' : 'Create Benefit'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Benefit Name */}
            <CustomFormSelect
              name="benefit_name"
              control={control}
              items={benefitNameOptions}
              labelText="Benefit Name"
              holder="Select benefit name"
              error={errors.benefit_name?.message}
            />

            {/* Description */}
            <CustomFormField
              name="description"
              control={control}
              label="Description"
              placeholder="write a short description of the benefit"
              textarea={true}
              rows={4}
              error={errors.description?.message}
            />

            {/* Benefit Type */}
            <CustomFormSelect
              name="benefit_type"
              control={control}
              items={benefitTypeOptions}
              labelText="Benefit Type"
              holder="Select benefit type"
              error={errors.benefit_type?.message}
            />

            {/* Unit and Unit Default Allocation */}
            <div className="grid grid-cols-2 gap-4">
              <CustomFormSelect
                name="unit"
                control={control}
                items={unitOptions}
                labelText="Unit"
                holder="Select unit"
                error={errors.unit?.message}
              />

              <CustomFormField
                name="allocation"
                control={control}
                label="Unit Default Allocation"
                placeholder={
                  watchedBenefitType === 'leave'
                    ? 'Enter number of days'
                    : watchedBenefitType === 'monetary_allowance' ||
                      watchedBenefitType === 'allowance'
                    ? 'Enter amount'
                    : 'Enter allocation'
                }
                error={errors.allocation?.message}
              />
            </div>

            {/* Renewal Cycle */}
            <CustomFormSelect
              name="recurring"
              control={control}
              items={renewalCycleOptions}
              labelText="Renewal Cycle"
              holder="Select renewal cycle"
              error={errors.recurring?.message}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isAdding || !isFormValid}
              className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditMode
                ? 'Update Benefit'
                : isAdding
                ? 'loading...'
                : 'Create Benefit'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBenefitModal;
