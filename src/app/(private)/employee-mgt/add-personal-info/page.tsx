'use client';

import { useRouter } from 'next/navigation';
import { IoMdArrowBack } from 'react-icons/io';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  userDetailsSchema,
  userDetailsSchemaType,
} from '@/src/utils/validations';

import { Form } from '@/src/components/ui/form';
import Calendar from 'react-calendar';
import { FiCalendar } from 'react-icons/fi';
import { formatDate } from '@/src/utils/helper';
import { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { SingleValue } from '@/src/types/attendance';
import { useGetCountries } from '@/src/service/query/location';
import {
  CustomFormField,
  CustomFormSelect,
} from '@/src/components/common/CustomInput';

const PersonalInfo = () => {
  const router = useRouter();
  const form = useForm<userDetailsSchemaType>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      maritalStatus: '',
      address: {
        country: '',
        residentialAddress: '',
      },
      emergencyContact: {
        fullName: '',
        relationship: '',
        phoneNumber: '',
      },
    },
  });
  const { control, formState } = form;
  const { errors, isValid } = formState;

  const [showCalendar, setShowCalendar] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  const handleDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setDateOfBirth(value);
      setShowCalendar(false);
    }
  };

  const { data: countries, isLoading: isCountryLoading } = useGetCountries();

  const customStyles: StylesConfig<SingleValue, false> = {
    control: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#ffff',
      border: '1px solid #E4E7EC',
      borderRadius: '8px',
      boxShadow: 'none',
      minHeight: '40px',
      padding: '0 12px',
      fontSize: '14px',
      color: '#1D2939',
      outline: 'none',
      '&:hover': {
        borderColor: '#692E9F',
      },
      '&:focus': {
        borderColor: 'transparent',
        outline: 'none',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '12px',
      color: '#b3b3b3',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      marginTop: '4px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      zIndex: 10,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#F0EAF5' : 'transparent',
      color: '#333333',
      fontSize: '12px',
      padding: '10px 8px',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#EAEAEA',
      },
    }),
  };

  function onSubmit(values: userDetailsSchemaType) {
    console.log(values);
    router.push('/employee-mgt/employee-details');
  }
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
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-semibold">
              1
            </div>
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
            <div className="grid md:grid-cols-2 gap-5 pb-5 border-b-2 border-[#E4E7EC]">
              <CustomFormField
                label="Full Name"
                name="fullName"
                control={control}
                placeholder="Enter full name"
                error={errors.fullName?.message}
              />
              <CustomFormField
                label="Email Address"
                name="email"
                control={control}
                placeholder="Enter email"
                error={errors.email?.message}
              />
              {/* Phone Number Field */}
              <CustomFormField
                label="Phone Number"
                name="phoneNumber"
                control={control}
                placeholder="Enter  phone number"
                error={errors.phoneNumber?.message}
              />
              <div className="w-full box">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Birth Date
                </p>
                <div className="w-full relative">
                  {/* Input-like div */}
                  <div
                    className={`flex gap-4 border-2 bg-[#ffff]  border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                      dateOfBirth ? 'justify-between' : 'justify-end'
                    } items-center p-[10px]`}
                    onClick={() => setShowCalendar((prev) => !prev)}
                  >
                    <p className="text-xs text-[#292D32]">
                      {dateOfBirth ? formatDate(dateOfBirth) : 'Pick date'}
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
                        value={dateOfBirth || new Date()} // Default to today's date
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
              </div>

              {/* Gender Field */}
              <CustomFormSelect
                name="gender"
                control={control}
                items={['Male', 'Female', 'Other']}
                labelText="Gender"
                holder="Select Gender"
                error={errors.gender?.message}
              />

              {/* Marital Status Field */}
              <CustomFormSelect
                name="maritalStatus"
                control={control}
                items={['Single', 'Married', 'Divorced']}
                labelText="Marital Status"
                holder="Select Marital Status"
                error={errors.maritalStatus?.message}
              />
            </div>
            <div className="grid py-5 border-b-2 border-[#E4E7EC]">
              <p className="pb-5 font-semibold text-[#1D2939]">Address</p>

              {/* Country Field */}
              <div className="w-full md:w-[49.8%]">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Country
                </p>
                <Select
                  instanceId="fixed-id"
                  options={countries}
                  isLoading={isCountryLoading}
                  styles={customStyles}
                  placeholder="Select Country"
                  onChange={(selectedOption) =>
                    form.setValue(
                      'address.country',
                      selectedOption?.value || ''
                    )
                  }
                />
                {errors.address?.country?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.address.country.message}
                  </p>
                )}
              </div>
              <div className="mt-5">
                {/* Residential Address Field */}
                <CustomFormField
                  name="address.residentialAddress"
                  control={control}
                  label="Residential Address"
                  placeholder="Enter residential address"
                  error={errors.address?.residentialAddress?.message}
                  textarea
                  rows={4}
                />
              </div>
            </div>
            <div className="pb-5 mt-5  border-[#E4E7EC]">
              <h4 className="font-semibold text-[#1D2939]">
                Emergency Contact
              </h4>
              <div className="grid md:grid-cols-2 gap-5 ">
                <CustomFormField
                  label="Full Name"
                  name="emergencyContact.fullName"
                  control={control}
                  placeholder="Enter full name"
                  error={errors?.emergencyContact?.fullName?.message}
                />

                {/* Gender Field */}
                <CustomFormSelect
                  name="emergencyContact.relationship"
                  control={control}
                  items={[
                    'Spouse',
                    'Parent',
                    'Sibling',
                    'Child',
                    'Friend',
                    'Relative',
                    'Colleague',
                    'Other',
                  ]}
                  labelText="Relationship"
                  holder="Select Relationship"
                  error={errors.emergencyContact?.relationship?.message}
                />

                {/* Phone Number Field */}
                <CustomFormField
                  label="Phone Number"
                  name="emergencyContact.phoneNumber"
                  control={control}
                  placeholder="Enter phone number"
                  error={errors?.emergencyContact?.phoneNumber?.message}
                />
              </div>
            </div>
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
                Next
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default PersonalInfo;
