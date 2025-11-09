"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import {
  CustomFormField,
  CustomFormSelect,
} from "@/src/components/common/CustomInput";
import { Check, ChevronDown } from "lucide-react";

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
  leaveTypes: any;
}

interface BenefitFormData {
  benefit_name: string;
  description: string;
  benefit_type: string;
  unit: string;
  allocation: string;
  recurring: string;
}

const benefitTypeOptions = [
  { value: "leave", label: "Leave" },
  { value: "Monetary Allowance", label: "Monetary Allowance" },
  { value: "Meal Voucher", label: "Meal Voucher" },
  { value: "Transportation Voucher", label: "Transportation Voucher" },
  { value: "Insurance", label: "Insurance" },
];

const unitOptions = [
  { value: "days", label: "Days" },
  { value: "amount", label: "Amount" },
  { value: "vouchers", label: "Vouchers" },
  { value: "policy", label: "Policy" },
];

const renewalCycleOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "none", label: "None" },
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

  return "";
};

const AddBenefitModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode = false,
  editingBenefit = null,
  isAdding,
  leaveTypes,
}: AddBenefitModalProps) => {
  const form = useForm<BenefitFormData>({
    defaultValues: {
      benefit_name: "",
      description: "",
      benefit_type: "",
      unit: "",
      allocation: "",
      recurring: "",
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    register,
    formState: { errors },
  } = form;
  const watchedBenefitType = watch("benefit_type");
  const [showDropdown, setShowDropdown] = useState(false);

  const values = getValues();
  console.log("v", values);

  // Watch all form fields for validation
  const watchedValues = watch();

  // Check if all fields are filled
  const isFormValid = Object.values(watchedValues).every(
    (value) => value !== "" && value !== null && value !== undefined
  );
  const benefit_name = watch("benefit_name");

  console.log("edit", editingBenefit);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editingBenefit) {
      setValue("benefit_name", editingBenefit.benefit_name); // Direct string assignment
      setValue("description", editingBenefit.description);
      setValue(
        "benefit_type",
        mapApiToFormValue(editingBenefit.benefit_type, benefitTypeOptions)
      );
      setValue("unit", mapApiToFormValue(editingBenefit.unit, unitOptions));
      setValue("allocation", editingBenefit.allocation);
      setValue(
        "recurring",
        mapApiToFormValue(editingBenefit.recurring, renewalCycleOptions)
      );
    } else {
      reset();
    }
  }, [isEditMode, editingBenefit, setValue, reset]);

  // Auto-change unit based on benefit type using useEffect
  useEffect(() => {
    if (watchedBenefitType) {
      switch (watchedBenefitType) {
        case "leave":
          setValue("unit", "days");
          break;
        case "Monetary Allowance":
          setValue("unit", "amount");
          break;
        case "Meal Voucher":
        case "Transportation Voucher":
          setValue("unit", "vouchers");
          break;
        case "Insurance":
          setValue("unit", "policy");
          break;
        default:
          setValue("unit", "");
      }
    }
  }, [watchedBenefitType, setValue]);

  const handleFormSubmit = (data: BenefitFormData) => {
    onSubmit?.(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectLeaveType = (type: string) => {
    setValue("benefit_name", type);
    setShowDropdown(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-[#1D2939]">
            {isEditMode ? "Edit Benefit" : "Create Benefit"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Benefit Type */}
            <CustomFormSelect
              name="benefit_type"
              control={control}
              items={benefitTypeOptions}
              labelText="Benefit Type"
              holder="Select benefit type"
              error={errors.benefit_type?.message}
            />

            {values.benefit_type === "leave" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    onClick={toggleDropdown}
                  >
                    <span>{benefit_name || "Select leave type"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  <input
                    type="hidden"
                    {...register("benefit_name", { required: true })}
                  />

                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                      {leaveTypes.length > 0 &&
                        leaveTypes?.map((type: any) => (
                          <div
                            key={type?.leave_name}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                            onClick={() => selectLeaveType(type.leave_name)}
                          >
                            {type?.leave_name}
                            {type?.leave_name === benefit_name && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {errors.benefit_name?.message && (
                  <p className="text-red-500 text-xs">
                    {errors.benefit_name?.message}
                  </p>
                )}
              </div>
            ) : (
              <CustomFormField
                name="benefit_name"
                control={control}
                label="Benefit Name"
                placeholder="Enter benefit name e.g Paid Leave"
                error={errors.benefit_name?.message}
              />
            )}

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

            {/* Unit and Unit Default Allocation */}
            <div
              style={{ gridTemplateColumns: "1fr 2fr" }}
              className="grid  gap-4"
            >
              <CustomFormField
                name="unit"
                control={control}
                label="Unit"
                placeholder="Auto-selected based on type"
                readOnly={true}
                error={errors.unit?.message}
              />

              <CustomFormField
                name="allocation"
                control={control}
                label="Unit Default Allocation"
                placeholder={
                  watchedBenefitType === "leave"
                    ? "Enter number of days"
                    : watchedBenefitType === "Monetary Allowance"
                    ? "Enter amount"
                    : "Enter allocation"
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
                ? "Update Benefit"
                : isAdding
                ? "loading..."
                : "Create Benefit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBenefitModal;
