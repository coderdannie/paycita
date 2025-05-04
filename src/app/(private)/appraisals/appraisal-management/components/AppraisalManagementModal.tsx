import { FC, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/src/components/ui/form";
import {
  CustomFormField,
  CustomFormSelect,
} from "@/src/components/common/CustomInput";
import Calendar from "react-calendar";
import { FiCalendar } from "react-icons/fi";
import { formatDate } from "@/src/utils/helper";
import { useGetDepartments } from "@/src/hooks/dashboard/useDashboard";
import { useCreateAppraisal } from "@/src/hooks/appraisal/useAppraisal";
import { AppraisalFormValues } from "@/src/types/appraisal";
import Select, { StylesConfig, SingleValue } from "react-select";
import toast from "react-hot-toast";

type DepartmentOption = { label: string; value: string };

const appraisalSchema = z
  .object({
    title: z.string().min(1, { message: "Appraisal title is required" }),
    start_date: z.string().min(1, { message: "Start date is required" }),
    end_date: z.string().min(1, { message: "End date is required" }),
    notification_type: z.enum(["all", "department"], {
      required_error: "Notification type is required",
    }),
    department_id: z.union([z.string(), z.number()]).optional(),
  })
  .refine(
    (data) => {
      if (data.notification_type === "department") {
        return !!data.department_id;
      }
      return true;
    },
    {
      message: "Department is required when notification type is department",
      path: ["department_id"],
    }
  ) satisfies z.ZodType<AppraisalFormValues>;

interface CreateAppraisalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const customStyles: StylesConfig<DepartmentOption, false> = {
  control: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "2px solid #E4E7EC",
    borderRadius: "8px",
    boxShadow: "none",
    minHeight: "40px",
    padding: "0 12px",
    fontSize: "14px",
    color: "#1D2939",
    outline: "none",
    "&:hover": {
      borderColor: "#692E9F",
    },
    "&:focus": {
      borderColor: "transparent",
      outline: "none",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "12px",
    color: "#b3b3b3",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "10px",
    marginTop: "4px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#F0EAF5" : "transparent",
    color: "#333333",
    fontSize: "12px",
    padding: "10px 8px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#EAEAEA",
    },
  }),
};

const CreateAppraisalModal: FC<CreateAppraisalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const form = useForm<AppraisalFormValues>({
    resolver: zodResolver(appraisalSchema),
    defaultValues: {
      title: "",
      start_date: "",
      end_date: "",
      notification_type: "all",
      department_id: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const { departmentOptions, isPending: isPendingDepartment } =
    useGetDepartments();
  const { mutate: createAppraisal, isPending } = useCreateAppraisal();

  const start_date = watch("start_date");
  const end_date = watch("end_date");
  const notification_type = watch("notification_type");

  // Watch for notification_type changes and clear department if switching to "all"
  useEffect(() => {
    if (notification_type === "all") {
      setValue("department_id", "", { shouldValidate: true });
    }
  }, [notification_type, setValue]);

  const handleStartDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setValue("start_date", formatDate(value), { shouldValidate: true });
      setShowStartCalendar(false);
    }
  };

  const handleEndDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setValue("end_date", formatDate(value), { shouldValidate: true });
      setShowEndCalendar(false);
    }
  };

  const handleDepartmentChange = (
    selectedOption: SingleValue<DepartmentOption> | null
  ) => {
    if (selectedOption) {
      setValue("department_id", selectedOption.value.toString(), {
        shouldValidate: true,
      });
    } else {
      setValue("department_id", "", { shouldValidate: true });
    }
  };

  const onSubmit = (data: AppraisalFormValues) => {
    const submissionData = {
      ...data,
      department_id:
        data.notification_type === "department"
          ? data.department_id
          : undefined,
    };

    createAppraisal(submissionData, {
      onSuccess: (res) => {
        reset();
        onClose();
        toast.success(res.data.message || "Appraisal created successfully");
      },
      onError: (error: { response?: { data?: { message?: string } } }) => {
        console.error(
          "Error creating appraisal:",
          error.response?.data?.message || "Failed to create appraisal"
        );
        toast.error(
          error.response?.data?.message || "Failed to create appraisal"
        );
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Appraisal</h2>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              control={control}
              name="title"
              label="Appraisal Title"
              placeholder="Enter appraisal title"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <div
                    className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                      start_date ? "justify-between" : "justify-end"
                    } items-center p-[10px] ${
                      errors.start_date ? "border-red-500" : ""
                    }`}
                    onClick={() => setShowStartCalendar((prev) => !prev)}
                  >
                    <p className="text-xs text-[#292D32]">
                      {start_date || "Pick date"}
                    </p>
                    <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                  </div>
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.start_date.message}
                    </p>
                  )}
                  {showStartCalendar && (
                    <div className="absolute max-w-[350px] mt-2 w-full z-30">
                      <Calendar
                        onChange={handleStartDateChange}
                        value={start_date ? new Date(start_date) : new Date()}
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <div
                    className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                      end_date ? "justify-between" : "justify-end"
                    } items-center p-[10px] ${
                      errors.end_date ? "border-red-500" : ""
                    }`}
                    onClick={() => setShowEndCalendar((prev) => !prev)}
                  >
                    <p className="text-xs text-[#292D32]">
                      {end_date || "Pick date"}
                    </p>
                    <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                  </div>
                  {errors.end_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.end_date.message}
                    </p>
                  )}
                  {showEndCalendar && (
                    <div className="absolute max-w-[350px] mt-2 w-full z-30">
                      <Calendar
                        onChange={handleEndDateChange}
                        value={end_date ? new Date(end_date) : new Date()}
                        minDate={start_date ? new Date(start_date) : new Date()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CustomFormSelect
              control={control}
              name="notification_type"
              labelText="Notification Type"
              items={["all", "department"]}
              holder="Select notification type"
            />

            {notification_type === "department" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <Select
                  instanceId="department-select"
                  options={departmentOptions}
                  isLoading={isPendingDepartment}
                  styles={customStyles}
                  placeholder="Select department"
                  onChange={handleDepartmentChange}
                  value={departmentOptions?.find(
                    (option) => option.value === watch("department_id")
                  )}
                />
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 px-4 bg-[#692E9F] hover:bg-purple-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateAppraisalModal;
