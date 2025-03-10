'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { loginSchema, LoginSchemaType } from '@/src/utils/validations';
import { CustomFormField } from '@/src/components/common/CustomInput';

const Login = () => {
  const router = useRouter();

  // Initialize the form
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  // Form submission handler
  function onSubmit(values: LoginSchemaType) {
    console.log(values);
    router.push('/dashboard');
  }

  return (
    <div className="w-full">
      <h3 className="text-[#23262F] pb-5 font-bold text-lg md:text-xl text-center">
        Log in to your account
      </h3>

      {/* Wrap the form in FormProvider */}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col space-y-6">
            {/* Email Field */}
            <div>
              <CustomFormField
                auth
                label="Work Email"
                name="email"
                control={form.control}
                placeholder="Enter your work email"
                error={errors.email?.message}
              />
            </div>

            {/* Password Field */}
            <div>
              <CustomFormField
                auth
                label="Password"
                name="password"
                control={form.control}
                placeholder="Enter your password"
                showPasswordToggle={true}
                isPassword={true}
                error={errors.password?.message}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-[48px] font-bold  bg-primary text-white py-2 rounded-full mt-6 "
          >
            Login
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Login;
