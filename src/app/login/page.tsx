"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "@/src/utils/validations";
import { CustomFormField } from "@/src/components/common/CustomInput";
import LeftSide from "@/src/components/Layouts/NonAuthLayout/LeftSide";
import { useAuth } from "@/src/context/authContext";
import { Spinner } from "react-activity";

const Login = () => {
	const router = useRouter();
	const { handleLogin, isLogginIn } = useAuth();

	// Initialize the form
	const form = useForm<LoginSchemaType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const {
		handleSubmit,
		formState: { errors },
	} = form;

	// Form submission handler
	function onSubmit(values: LoginSchemaType) {
		console.log(values);
		handleLogin(values);
		// router.push('/dashboard');
	}

	return (
		<div className='h-screen grid md:[grid-template-columns:530px_1fr] '>
			<div className='hidden md:block h-screen bg-[#551A8B] overflow-y-auto '>
				<LeftSide />
			</div>
			<div className='w-full p-5 max-w-[500px] mx-auto grid place-items-center h-screen overflow-y-auto'>
				<div className='w-full'>
					<h3 className='text-[#23262F] pb-5 font-bold text-lg md:text-xl text-center'>
						Log in to your account
					</h3>

					{/* Wrap the form in FormProvider */}
					<FormProvider {...form}>
						<form onSubmit={handleSubmit(onSubmit)} className='w-full'>
							<div className='flex flex-col space-y-6'>
								{/* Email Field */}
								<div>
									<CustomFormField
										auth
										label='Work Email'
										name='email'
										control={form.control}
										placeholder='Enter your work email'
										error={errors.email?.message}
									/>
								</div>

								{/* Password Field */}
								<div>
									<CustomFormField
										auth
										label='Password'
										name='password'
										control={form.control}
										placeholder='Enter your password'
										showPasswordToggle={true}
										isPassword={true}
										error={errors.password?.message}
									/>
								</div>
							</div>

							{/* Submit Button */}
							<button
								type='submit'
								className='w-full h-[48px] font-bold  bg-primary text-white py-2 rounded-full mt-6 flex items-center justify-center '
							>
								{isLogginIn ? <Spinner /> : "Login"}
							</button>
						</form>
					</FormProvider>
				</div>
			</div>
		</div>
	);
};

export default Login;
