'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdArrowBack } from 'react-icons/io';
import {
  CustomFormField,
  CustomFormSelect,
} from '@/src/components/common/CustomInput';
import {
  employeeDetailsSchema,
  EmployeeDetailsSchemaType,
} from '@/src/utils/validations';
import { Form } from '@/src/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Calendar from 'react-calendar';
import { FiCalendar } from 'react-icons/fi';
import { formatDate } from '@/src/utils/helper';
import { IoIosCheckmarkCircle } from 'react-icons/io';

const EmployeeDetails = () => {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);

  const form = useForm<EmployeeDetailsSchemaType>({
    resolver: zodResolver(employeeDetailsSchema),
    defaultValues: {
      employeeNumber: '',
      employeeName: '',
      jobTitle: '',
      jobLevel: '',
      employmentType: '',
      locationType: '',
      hireDate: '',
    },
  });

  const {
    control,
    formState: { errors, isValid },
    setValue,
    watch,
  } = form;

  const hireDate = watch('hireDate'); // Get the current value of hireDate

  const handleDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setValue('hireDate', formatDate(value)); // Format the date as needed
      setShowCalendar(false);
    }
  };

  const onSubmit = (values: EmployeeDetailsSchemaType) => {
    console.log(values); // Handle form submission
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        <button onClick={() => router.back()}>
          <IoMdArrowBack />{' '}
        </button>

        <h2 className="text-[#1D2939] font-bold text-lg md:text-xl">
          Add Employee
        </h2>
      </div>
      <div className=" max-w-[960px] mx-auto mt-[40px]">
        <div className="flex items-center justify-center mb-8 space-x-4 text-sm">
          <div className="flex items-center space-x-2 ">
            <IoIosCheckmarkCircle className="text-primary w-8 h-8" />
            <span className="font-semibold text-gray-900">Personal info</span>
          </div>

          <div className="w-10 h-px bg-gray-300"></div>

          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">
              2
            </div>
            <span>Employee details</span>
          </div>
        </div>
        <h4 className="font-semibold text-[#1D2939]">Basic information</h4>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" pt-8">
            <CustomFormField
              name="employeeNumber"
              control={control}
              label="Employee Number"
              placeholder="Enter employee number"
              error={errors.employeeNumber?.message}
            />
            <div className="grid md:grid-cols-2 gap-5 pb-5 mt-5 ">
              {' '}
              {/* Employee Name */}
              <CustomFormField
                name="employeeName"
                control={control}
                label="Employee Name"
                placeholder="Enter employee name"
                error={errors.employeeName?.message}
              />
              {/* Job Title */}
              <CustomFormField
                name="jobTitle"
                control={control}
                label="Job Title"
                placeholder="Enter job title"
                error={errors.jobTitle?.message}
              />
              {/* Job Level */}
              <CustomFormSelect
                name="jobLevel"
                control={control}
                items={['Entry', 'Mid', 'Senior', 'Executive']}
                labelText="Job Level"
                holder="Select job level"
                error={errors.jobLevel?.message}
              />
              {/* Employment Type */}
              <CustomFormSelect
                name="employmentType"
                control={control}
                items={['Full-Time', 'Part-Time', 'Contract', 'Internship']}
                labelText="Employment Type"
                holder="Select employment type"
                error={errors.employmentType?.message}
              />
              {/* Location Type */}
              <CustomFormSelect
                name="locationType"
                control={control}
                items={['Onsite', 'Remote', 'Hybrid']}
                labelText="Location Type"
                holder="Select location type"
                error={errors.locationType?.message}
              />
              {/* Hire Date */}
              <div className="w-full box">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Hire Date
                </p>
                <div className="w-full relative">
                  {/* Input-like div */}
                  <div
                    className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                      hireDate ? 'justify-between' : 'justify-end'
                    } items-center p-[10px]`}
                    onClick={() => setShowCalendar((prev) => !prev)}
                  >
                    <p className="text-xs text-[#292D32]">
                      {hireDate ? hireDate : 'Pick date'}
                    </p>
                    <div>
                      <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                    </div>
                  </div>

                  {/* Calendar popup */}
                  {showCalendar && (
                    <div className="absolute max-w-[350px] mt-2 w-full z-30">
                      <Calendar
                        onChange={handleDateChange}
                        value={hireDate ? new Date(hireDate) : new Date()} // Default to today's date
                        maxDate={new Date()} // Disable future dates
                        tileClassName={
                          ({ date }) =>
                            date.getDay() === 0 || date.getDay() === 6
                              ? 'weekend'
                              : '' // Optional: Style weekends
                        }
                      />
                    </div>
                  )}
                </div>
                {errors.hireDate?.message && (
                  <p className="text-sm text-red-500">
                    {errors.hireDate.message}
                  </p>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex gap-4 md:justify-end h-[40px]">
              <button
                type="button"
                className="h-full font-semibold text-primary border border-primary px-[30px] text-sm rounded-lg"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                className={`btn-primary px-[30px] ${
                  !isValid && '!bg-transparent !text-[#98A2B3]'
                }`}
                disabled={!isValid}
              >
                Submit
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default EmployeeDetails;
