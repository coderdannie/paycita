"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import {
  CustomFormField,
  CustomFormSelect,
} from "@/src/components/common/CustomInput";
import {
  employeeDetailsSchema,
  EmployeeDetailsSchemaType,
} from "@/src/utils/validations";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Calendar from "react-calendar";
import { FiCalendar } from "react-icons/fi";
import { formatDate } from "@/src/utils/helper";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  useAddEmployee,
  useGetDepartments,
  useGetGivenItems,
  useGetPensionCompanies,
} from "@/src/hooks/dashboard/useDashboard";
import { useUserDetailSelector } from "@/src/Redux/selectors";
import { useDispatch } from "react-redux";
import { resetUserDetails } from "@/src/Redux/features/userDetailsSlice";
import Select, { StylesConfig } from "react-select";
import { SingleValue } from "@/src/types/attendance";
import { useToast } from "@/src/context/ToastContext";

const JOB_LEVELS = ["Staff", "Mid", "Senior", "Executive"] as string[];
const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
] as string[];
const LOCATION_TYPES = ["Onsite", "Remote", "Hybrid"] as string[];

const ROLE = [
  {
    value: "user",
    label: "User",
  },
  {
    value: "hr",
    label: "Hr",
  },
  {
    value: "finance_manager",
    label: "Finance Manager",
  },
  {
    value: "procurement_manager",
    label: "Procurement Manager",
  },
];

const TAX_STATUSES = ["Taxable", "Non-Taxable"] as string[];

const EmployeeDetails = () => {
  const customStyles: StylesConfig<SingleValue, false> = useMemo(
    () => ({
      control: (provided) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ffff",
        border: "1px solid #E4E7EC",
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
    }),
    []
  );
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const userDetails = useUserDetailSelector();
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOfficeLetter, setIsOfficeLetter] = useState(false);
  const { departmentOptions, isPending: isPendingDepartment } =
    useGetDepartments();
  const { pensionCompanyOptions, isPending: isPendingPensionCompany } =
    useGetPensionCompanies();
  const { givenItemsOptions } = useGetGivenItems();

  const form = useForm<EmployeeDetailsSchemaType>({
    resolver: zodResolver(employeeDetailsSchema),
    defaultValues: {
      department_id: departmentOptions?.[0]?.value || "",
      job_title: "",
      job_level: "",
      role: "",
      employment_type: "",
      job_location: "",
      hire_date: "",
      salary: "",
      tax_status: "",
      tax_number: "",
      pension_company: "",
      company_email: "",
    },
    mode: "onTouched",
  });

  const {
    control,
    formState: { errors, isValid },
    setValue,
    watch,
    handleSubmit,
    trigger,
  } = form;

  const hire_date = watch("hire_date");

  const { mutateAddEmployee, isPending } = useAddEmployee();

  const handleCheckboxChange = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setValue("hire_date", formatDate(value), { shouldValidate: true });
      setShowCalendar(false);
    }
  };

  const onSubmit = (values: EmployeeDetailsSchemaType) => {
    const payload = {
      ...values,
      ...userDetails,
      country: userDetails?.address?.country,
      address: userDetails?.address?.residentialAddress,
      emergency_contact_name:
        userDetails?.emergencyContact?.emergency_contact_name,
      emergency_contact_relationship:
        userDetails?.emergencyContact?.emergency_contact_relationship,
      emergency_contact_phone:
        userDetails?.emergencyContact?.emergency_contact_phone,
      office_items_given: selectedItems,
      offer_letter: isOfficeLetter ? "yes" : "no",
      guarantor_1_name: userDetails?.guarantors[0]?.fullName,
      guarantor_1_phone: userDetails?.guarantors[0]?.phoneNumber,
      guarantor_1_address: userDetails?.guarantors[0]?.address,
      guarantor_1_relationship: userDetails?.guarantors[0]?.relationship,
      guarantor_2_name: userDetails?.guarantors[1]?.fullName,
      guarantor_2_phone: userDetails?.guarantors[1]?.phoneNumber,
      guarantor_2_address: userDetails?.guarantors[1]?.address,
      guarantor_2_relationship: userDetails?.guarantors[1]?.relationship,
    };

    console.log(payload);
    mutateAddEmployee(payload, {
      onSuccess: (res) => {
        dispatch(resetUserDetails());
        addToast(res.data.message || "Employee Added Successfully", "success");
        router.push("/employee-mgt");
      },
      onError: (error: {
        response: {
          data: {
            message: string;
          };
        };
      }) => {
        console.error("Error adding employee:", error);
        addToast(
          error?.response?.data?.message || "Error adding employee",
          "error"
        );
      },
    });
  };

  const handleCheckChange = (checked: boolean) => {
    setIsOfficeLetter(checked);
  };

  // Trigger validation when hire_date changes
  useEffect(() => {
    if (hire_date) {
      trigger("hire_date");
    }
  }, [hire_date, trigger]);

  const handleChangeDepartment = (selectedOption: SingleValue | null) => {
    const departmentValue = selectedOption?.value || "";
    form.setValue("department_id", +departmentValue, { shouldValidate: true });
  };
  const handleChangeRole = (selectedOption: SingleValue | null) => {
    const roleValue = selectedOption?.value || "";
    form.setValue("role", roleValue, { shouldValidate: true });
  };
  const handleChangeCompany = (selectedOption: SingleValue | null) => {
    const companyValue = selectedOption?.label || "";
    form.setValue("pension_company", companyValue, { shouldValidate: true });
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        <button onClick={() => router.back()}>
          <IoMdArrowBack />
        </button>
        <h2 className="text-[#1D2939] font-bold text-lg md:text-xl">
          Add Employee
        </h2>
      </div>

      <div className="max-w-[960px] mx-auto mt-[40px]">
        <div className="flex items-center justify-center mb-8 space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <IoIosCheckmarkCircle className="text-primary w-8 h-8" />
            <span className="font-semibold text-gray-900">Personal info</span>
          </div>

          <div className="w-10 h-px bg-gray-300"></div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-semibold">
              2
            </div>
            <span className="font-semibold text-gray-900">
              Employee details
            </span>
          </div>
        </div>

        <h4 className="font-semibold text-[#1D2939]">Basic information</h4>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="pt-8">
            <div className="grid md:grid-cols-2 gap-5 pb-5 mt-5">
              <CustomFormField
                name="job_title"
                control={control}
                label="Job Title"
                placeholder="Enter job title"
                error={errors.job_title?.message}
              />
              <CustomFormSelect
                name="job_level"
                control={control}
                items={JOB_LEVELS}
                labelText="Job level"
                holder="Select job level"
                error={errors.job_level?.message}
              />
              <CustomFormSelect
                name="employment_type"
                control={control}
                items={EMPLOYMENT_TYPES}
                labelText="Employment Type"
                holder="Select employment type"
                error={errors.employment_type?.message}
              />
              <CustomFormSelect
                name="job_location"
                control={control}
                items={LOCATION_TYPES}
                labelText="Location Type"
                holder="Select location type"
                error={errors.job_location?.message}
              />
              <div className="w-full">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Department
                </p>
                <Select
                  instanceId="country-department_id"
                  options={departmentOptions}
                  isLoading={isPendingDepartment}
                  styles={customStyles}
                  placeholder="Select Department"
                  onChange={handleChangeDepartment}
                  value={departmentOptions?.find(
                    (option) => option.value === form.watch("department_id")
                  )}
                />
                {errors.department_id?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.department_id.message}
                  </p>
                )}
              </div> 
              <div className="w-full">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Role
                </p>
                <Select
                  instanceId="role"
                  options={ROLE}
                  styles={customStyles}
                  placeholder="Select Role"
                  onChange={handleChangeRole}
                  value={ROLE?.find(
                    (option) => option.value === form.watch("role")
                  )}
                />
                {errors.role?.message && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>
              <div className="w-full box">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Hire Date
                </p>
                <div className="w-full relative">
                  <div
                    className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                      hire_date ? "justify-between" : "justify-end"
                    } items-center p-[10px]`}
                    onClick={() => setShowCalendar((prev) => !prev)}
                  >
                    <p className="text-xs text-[#292D32]">
                      {hire_date || "Pick date"}
                    </p>
                    <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                  </div>

                  {showCalendar && (
                    <div className="absolute max-w-[350px] mt-2 w-full z-30">
                      <Calendar
                        onChange={handleDateChange}
                        value={hire_date ? new Date(hire_date) : new Date()}
                        maxDate={new Date()}
                        tileClassName={({ date }) =>
                          date.getDay() === 0 || date.getDay() === 6
                            ? "weekend"
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>
                {errors.hire_date?.message && (
                  <p className="text-sm text-red-500">
                    {errors.hire_date.message}
                  </p>
                )}
              </div>
              <CustomFormField
                name="company_email"
                control={control}
                label="Company email"
                placeholder="Enter Company Email"
                error={errors.company_email?.message}
              />
            </div>

            <h4 className="font-semibold text-[#1D2939] mt-8">Payroll & Tax</h4>
            <div className="grid md:grid-cols-2 gap-5 pb-5 mt-5">
              <CustomFormField
                name="salary"
                control={control}
                label="Basic Salary"
                placeholder="Enter basic salary"
                error={errors.salary?.message}
              />

              <CustomFormSelect
                name="tax_status"
                control={control}
                items={TAX_STATUSES}
                labelText="Tax Status"
                holder="Select tax status"
                error={errors.tax_status?.message}
              />

              <CustomFormField
                name="tax_number"
                control={control}
                label="Tax Number"
                placeholder="Enter tax number"
                error={errors.tax_number?.message}
              />

              <div className="w-full">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Pension Company
                </p>
                <Select
                  instanceId="pension_company"
                  options={pensionCompanyOptions}
                  isLoading={isPendingPensionCompany}
                  styles={customStyles}
                  placeholder="Select Company"
                  onChange={handleChangeCompany}
                  value={pensionCompanyOptions?.find(
                    (option) => option.value === form.watch("pension_company")
                  )}
                />
                {errors.pension_company?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.pension_company.message}
                  </p>
                )}
              </div>
           
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Select Required Items</h3>
              {givenItemsOptions.map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={selectedItems.includes(item.label)}
                    onCheckedChange={() => handleCheckboxChange(item.label)}
                  />
                  <label
                    htmlFor={item.label}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label.trim()}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex items-center w-full gap-1 mt-5 pt-5 border-t border-[#E4E7EC]">
              <Checkbox
                id="isOfficeLetter"
                checked={isOfficeLetter}
                onCheckedChange={handleCheckChange}
              />
              <label
                htmlFor="isOfficeLetter"
                className="text-[#1e2228] text-sm font-medium"
              >
                Do you want to attach offer letter?
              </label>
            </div>

            <div className="flex gap-4 md:justify-end h-[40px] mt-6">
              <button
                type="button"
                className="h-full font-semibold text-primary border border-primary px-[30px] text-sm rounded-lg"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn-primary px-[30px] ${
                  (!isValid || isPending) && "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isValid || isPending}
              >
                {isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeDetails;
