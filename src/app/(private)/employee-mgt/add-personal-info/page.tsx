'use client';

import { useRouter } from 'next/navigation';
import { IoMdArrowBack } from 'react-icons/io';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  userDetailsSchema,
  userDetailsSchemaType,
} from '@/src/utils/validations';
import { FaPlus } from 'react-icons/fa6';
import { Form } from '@/src/components/ui/form';
import Calendar from 'react-calendar';
import { FiCalendar } from 'react-icons/fi';
import { formatDate } from '@/src/utils/helper';
import { useEffect, useMemo, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { SingleValue } from '@/src/types/attendance';
import {
  CustomFormField,
  CustomFormSelect,
} from '@/src/components/common/CustomInput';
import { useGetCountries } from '@/src/hooks/location/useCountries';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '@/src/Redux/features/userDetailsSlice';
import { useUserDetailSelector } from '@/src/Redux/selectors';

const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Parent',
  'Sibling',
  'Child',
  'Friend',
  'Relative',
  'Colleague',
  'Other',
] as string[];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as string[];
const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced'] as string[];

const PersonalInfo = () => {
  const userDetails = useUserDetailSelector();
  const dispatch = useDispatch();
  const router = useRouter();

  const form = useForm<userDetailsSchemaType>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      gender: '',
      marital_status: '',
      address: {
        country: '',
        residentialAddress: '',
      },
      emergencyContact: {
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
      },
      guarantors: [
        { fullName: '', address: '', phoneNumber: '', relationship: '' },
        { fullName: '', address: '', phoneNumber: '', relationship: '' },
      ],
    },
    mode: 'onTouched',
  });

  const { control, formState, setValue, reset, handleSubmit } = form;
  const { errors } = formState;

  const [showCalendar, setShowCalendar] = useState(false);
  const [date_of_birth, setDateOfBirth] = useState<Date | null>(null);
  const [showGuarantorFields, setShowGuarantorFields] = useState(false);

  const { countries, isPending } = useGetCountries();

  const handleDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setDateOfBirth(value);
      setShowCalendar(false);
    }
  };

  const customStyles: StylesConfig<SingleValue, false> = useMemo(
    () => ({
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
    }),
    []
  );

  const onSubmit = (values: userDetailsSchemaType) => {
    const dataWithDateOfBirth = {
      ...values,
      date_of_birth: date_of_birth ? formatDate(date_of_birth) : null,
    };

    dispatch(setUserDetails(dataWithDateOfBirth));
    router.push('/employee-mgt/employee-details');
  };

  // useEffect(() => {
  //   if (date_of_birth) {
  //     form.trigger();
  //   }
  // }, [date_of_birth, form]);

  const handleCountryChange = (selectedOption: SingleValue | null) => {
    const countryValue = selectedOption?.value || '';
    form.setValue('address.country', countryValue, { shouldValidate: true });
  };

  const handleAddGuarantor = () => {
    setShowGuarantorFields(true);
  };

  useEffect(() => {
    if (!userDetails) return;

    setShowGuarantorFields(true);
    reset();

    // Set basic information
    setValue('full_name', userDetails.full_name || '');
    setValue('email', userDetails.email || '');
    setValue('phone_number', userDetails.phone_number || '');
    setValue('gender', userDetails.gender || '');
    setValue('marital_status', userDetails.marital_status || '');

    // Set address information
    setValue('address.country', userDetails.address?.country || '');
    setValue(
      'address.residentialAddress',
      userDetails.address?.residentialAddress || ''
    );

    // Set emergency contact information
    setValue(
      'emergencyContact.emergency_contact_name',
      userDetails.emergencyContact?.emergency_contact_name || ''
    );
    setValue(
      'emergencyContact.emergency_contact_relationship',
      userDetails.emergencyContact?.emergency_contact_relationship || ''
    );
    setValue(
      'emergencyContact.emergency_contact_phone',
      userDetails.emergencyContact?.emergency_contact_phone || ''
    );

    // Set guarantor information
    if (userDetails.guarantors?.length > 0) {
      setValue(
        `guarantors.0.fullName`,
        userDetails.guarantors[0]?.fullName || ''
      );
      setValue(
        `guarantors.0.address`,
        userDetails.guarantors[0]?.address || ''
      );
      setValue(
        `guarantors.0.phoneNumber`,
        userDetails.guarantors[0]?.phoneNumber || ''
      );
      setValue(
        `guarantors.0.relationship`,
        userDetails.guarantors[0]?.relationship || ''
      );

      if (userDetails.guarantors.length > 1) {
        setValue(
          `guarantors.1.fullName`,
          userDetails.guarantors[1]?.fullName || ''
        );
        setValue(
          `guarantors.1.address`,
          userDetails.guarantors[1]?.address || ''
        );
        setValue(
          `guarantors.1.phoneNumber`,
          userDetails.guarantors[1]?.phoneNumber || ''
        );
        setValue(
          `guarantors.1.relationship`,
          userDetails.guarantors[1]?.relationship || ''
        );
      }
    }

    // Set date of birth if available in userDetails
    if (userDetails.date_of_birth) {
      setDateOfBirth(new Date(userDetails.date_of_birth));
    }
  }, [setValue, userDetails, reset]);

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

      <div className="max-w-[960px] mx-auto mt-[40px]">
        <div className="flex items-center justify-center mb-8 space-x-4 text-sm">
          <div className="flex items-center space-x-2">
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
          <form onSubmit={handleSubmit(onSubmit)} className="pt-8">
            <div className="grid md:grid-cols-2 gap-5 pb-5 border-b-2 border-[#E4E7EC]">
              <CustomFormField
                label="Full Name"
                name="full_name"
                control={control}
                placeholder="Enter full name"
                error={errors.full_name?.message}
              />

              <CustomFormField
                label="Email Address"
                name="email"
                control={control}
                placeholder="Enter email"
                error={errors.email?.message}
              />

              <CustomFormField
                label="Phone Number"
                name="phone_number"
                control={control}
                placeholder="Enter phone number"
                error={errors.phone_number?.message}
              />

              <div className="w-full box">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Birth Date
                </p>
                <div className="w-full relative">
                  <div
                    className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                      date_of_birth ? 'justify-between' : 'justify-end'
                    } items-center p-[10px]`}
                    onClick={() => setShowCalendar((prev) => !prev)}
                  >
                    <p className="text-xs text-[#292D32]">
                      {date_of_birth ? formatDate(date_of_birth) : 'Pick date'}
                    </p>
                    <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                  </div>

                  {showCalendar && (
                    <div className="absolute max-w-[350px] mt-2 w-full z-30">
                      <Calendar
                        onChange={handleDateChange}
                        value={date_of_birth || new Date()}
                        maxDate={new Date()}
                        tileClassName={({ date }) =>
                          date.getDay() === 0 || date.getDay() === 6
                            ? 'weekend'
                            : ''
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <CustomFormSelect
                name="gender"
                control={control}
                items={GENDER_OPTIONS}
                labelText="Gender"
                holder="Select Gender"
                error={errors.gender?.message}
              />

              <CustomFormSelect
                name="marital_status"
                control={control}
                items={MARITAL_STATUS_OPTIONS}
                labelText="Marital Status"
                holder="Select Marital Status"
                error={errors.marital_status?.message}
              />
            </div>

            <div className="grid py-5 border-b-2 border-[#E4E7EC]">
              <p className="pb-5 font-semibold text-[#1D2939]">Address</p>

              <div className="w-full md:w-[49.8%]">
                <p className="font-semibold text-sm text-[#292D32] pb-2">
                  Country
                </p>
                <Select
                  instanceId="country-select"
                  options={countries}
                  isLoading={isPending}
                  styles={customStyles}
                  placeholder="Select Country"
                  onChange={handleCountryChange}
                  value={countries?.find(
                    (option) => option.value === form.watch('address.country')
                  )}
                />
                {errors.address?.country?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.address.country.message}
                  </p>
                )}
              </div>

              <div className="mt-5">
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

            <div className="pb-5 mt-5 border-[#E4E7EC]">
              <h4 className="font-semibold text-[#1D2939]">
                Emergency Contact
              </h4>
              <div className="grid md:grid-cols-2 gap-5">
                <CustomFormField
                  label="Full Name"
                  name="emergencyContact.emergency_contact_name"
                  control={control}
                  placeholder="Enter full name"
                  error={
                    errors.emergencyContact?.emergency_contact_name?.message
                  }
                />

                <CustomFormSelect
                  name="emergencyContact.emergency_contact_relationship"
                  control={control}
                  items={RELATIONSHIP_OPTIONS}
                  labelText="Relationship"
                  holder="Select Relationship"
                  error={
                    errors.emergencyContact?.emergency_contact_relationship
                      ?.message
                  }
                />

                <CustomFormField
                  label="Phone Number"
                  name="emergencyContact.emergency_contact_phone"
                  control={control}
                  placeholder="Enter phone number"
                  error={
                    errors.emergencyContact?.emergency_contact_phone?.message
                  }
                />
              </div>
            </div>

            <div className="pb-2 mt-5 border-[#E4E7EC]">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-[#1D2939]">
                    Guarantors (Optional)
                  </h4>
                  {errors.guarantors?.message && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.guarantors.message}
                    </p>
                  )}
                </div>
                {!showGuarantorFields && (
                  <button
                    type="button"
                    className="text-primary flex gap-2 items-center text-sm font-semibold"
                    onClick={handleAddGuarantor}
                  >
                    Add Guarantor
                    <FaPlus />
                  </button>
                )}
              </div>
            </div>

            {showGuarantorFields && (
              <>
                <div className="mt-6">
                  <h5 className="font-medium text-[#1D2939] mb-4">
                    Guarantor 1
                  </h5>
                  <div className="grid md:grid-cols-2 gap-5">
                    <CustomFormField
                      label="Full Name"
                      name="guarantors.0.fullName"
                      control={control}
                      placeholder="Enter full name"
                      error={errors.guarantors?.[0]?.fullName?.message}
                    />
                    <CustomFormField
                      label="Address"
                      name="guarantors.0.address"
                      control={control}
                      placeholder="Enter address"
                      error={errors.guarantors?.[0]?.address?.message}
                    />
                    <CustomFormField
                      label="Phone Number"
                      name="guarantors.0.phoneNumber"
                      control={control}
                      placeholder="Enter phone number"
                      error={errors.guarantors?.[0]?.phoneNumber?.message}
                    />
                    <CustomFormSelect
                      name="guarantors.0.relationship"
                      control={control}
                      items={RELATIONSHIP_OPTIONS}
                      labelText="Relationship"
                      holder="Select Relationship"
                      error={errors.guarantors?.[0]?.relationship?.message}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h5 className="font-medium text-[#1D2939] mb-4">
                    Guarantor 2
                  </h5>
                  <div className="grid md:grid-cols-2 gap-5">
                    <CustomFormField
                      label="Full Name"
                      name="guarantors.1.fullName"
                      control={control}
                      placeholder="Enter full name"
                      error={errors.guarantors?.[1]?.fullName?.message}
                    />
                    <CustomFormField
                      label="Address"
                      name="guarantors.1.address"
                      control={control}
                      placeholder="Enter address"
                      error={errors.guarantors?.[1]?.address?.message}
                    />
                    <CustomFormField
                      label="Phone Number"
                      name="guarantors.1.phoneNumber"
                      control={control}
                      placeholder="Enter phone number"
                      error={errors.guarantors?.[1]?.phoneNumber?.message}
                    />
                    <CustomFormSelect
                      name="guarantors.1.relationship"
                      control={control}
                      items={RELATIONSHIP_OPTIONS}
                      labelText="Relationship"
                      holder="Select Relationship"
                      error={errors.guarantors?.[1]?.relationship?.message}
                    />
                  </div>
                </div>
              </>
            )}

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
                  !formState.isValid &&
                  '!bg-gray-200 !text-[#98A2B3] !cursor-not-allowed'
                }`}
                disabled={!formState.isValid}
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
