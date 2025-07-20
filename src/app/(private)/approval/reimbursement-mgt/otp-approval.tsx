// "use client";
// import { Button } from "@material-tailwind/react";
// import { FiX } from "react-icons/fi";
// import React, { useRef, useState } from "react";
// import useApiRequest from "@/src/hooks/useApiRequest";
// import LoadingPage from "@/src/app/loading";




// const PinInput = ({
// 	onChange,
// 	approvalStatusId,
// }: {
// 	onChange: (code: string) => void;
// 	approvalStatusId: number;
// }) => {
// 	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
// 	const { getRequest, loading: isResendingOtp } = useApiRequest();

// 	const handleResendOtp = async () => {
// 		await getRequest(`/user/resend-otp/${approvalStatusId}`);
// 	};

// 	const handleChange = (
// 		index: number,
// 		e: React.ChangeEvent<HTMLInputElement>
// 	) => {
// 		const value = e.target.value;
// 		if (/^\d$/.test(value)) {
// 			if (index < inputsRef.current.length - 1) {
// 				inputsRef.current[index + 1]?.focus();
// 			}
// 		} else if (value === "") {
// 		} else {
// 			e.preventDefault();
// 			return;
// 		}
// 		onChange(inputsRef.current.map((input) => input?.value).join(""));
// 	};

// 	const handleKeyDown = (
// 		index: number,
// 		e: React.KeyboardEvent<HTMLInputElement>
// 	) => {
// 		if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
// 			inputsRef.current[index - 1]?.focus();
// 		}
// 	};

// 	return (
// 		<div className='w-full max-w-md text-cente mt-10'>
// 			<p className='mb-4  text-black_pry'>
// 				Please enter the code below to confirm this approval.
// 			</p>

// 			<div className='flex justify-center space-x-4 mb-3'>
// 				{[0, 1, 2, 3].map((i) => (
// 					<input
// 						key={i}
// 						type='text'
// 						maxLength={1}
// 						ref={(el) => (inputsRef.current[i] = el)}
// 						onChange={(e) => handleChange(i, e)}
// 						onKeyDown={(e) => handleKeyDown(i, e)}
// 						className='w-24 h-12 text-center text-xl border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out'
// 					/>
// 				))}
// 			</div>

// 			<div className='text-right '>
// 				Didn&apos;t get Code?{" "}
// 				<span
// 					onClick={handleResendOtp}
// 					className='text-pry hover:text-drk_pry hover:font-medium transition-colors duration-300 ease-linear cursor-pointer'
// 				>
// 					{isResendingOtp ? (
// 						<LoadingPage fullPage={false} size='small' text='Resending...' />
// 					) : (
// 						"Resend in 5 sec"
// 					)}
// 				</span>
// 			</div>
// 		</div>
// 	);
// };

// interface OTPApprovalModalProps {
// 	isOpen: boolean;
// 	onClose: () => void;
// 	title?: string;
// 	callback?: () => void;
// 	approvalStatusId: number;
// 	url?: string;
// 	payload?: any;
// }

// const OTPApprovalModal: React.FC<OTPApprovalModalProps> = ({
// 	isOpen,
// 	onClose,
// 	title = "",
// 	callback,
// 	approvalStatusId,
// 	url,
// 	payload,
// }) => {
// 	const { postRequest, loading } = useApiRequest();
// 	const [code, setCode] = useState("");
// 	if (!isOpen) return null;

// 	// Prevent body scroll when modal is open
// 	if (isOpen) {
// 		document.body.style.overflow = "hidden";
// 	}

// 	const handleConfirmApproval = async (code: string) => {
// 		await postRequest(
// 			url || "/user/verify-payment-otp",
// 			{
// 				otp: code,
// 				...payload,
// 			},
// 			(data) => {
// 				if (data.success) {
// 					callback?.();
// 					onClose();
// 				}
// 			}
// 		);
// 	};

// 	return (
// 		<div className='fixed inset-0 z-50 overflow-hidden '>
// 			{/* Backdrop */}
// 			<div
// 				className={`absolute inset-0 bg-black transition-opacity duration-500 ease-out ${
// 					isOpen ? "bg-opacity-30" : "bg-opacity-0"
// 				}`}
// 				onClick={() => {
// 					document.body.style.overflow = "";
// 					onClose();
// 				}}
// 				style={{ backdropFilter: "blur(1px)" }}
// 			/>

// 			{/* Side Panel */}
// 			<div
// 				className={`absolute top-0 right-0 bottom-0 sm:w-96 md:w-96 lg:w-[30rem] bg-white shadow-lg transform transition-all duration-1000 ease-in-out h-full rounded-lg overflow-y-auto ${
// 					isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
// 				}`}
// 			>
// 				{/* Header */}
// 				<div className='flex justify-between items-center p-6 border-b'>
// 					<h2 className='text-[1rem] font-medium'>{title}</h2>
// 					<button
// 						onClick={() => {
// 							document.body.style.overflow = "";
// 							onClose();
// 						}}
// 						className='text-gray-500 hover:bg-pry/10 rounded-md p-1 transition-all duration-300 ease-in-out'
// 					>
// 						<FiX size={20} />
// 					</button>
// 				</div>

// 				<div className='p-6 '>
// 					<div className='space-y-4'>
// 						<h2 className='font-medium text-2xl text-[#3A3A3A]'>
// 							Confirm Approval
// 						</h2>
// 						<p className='text-feint_4'>
// 							We've sent 4 digit verification code to your registered email.
// 						</p>
// 					</div>

// 					<PinInput
// 						approvalStatusId={approvalStatusId}
// 						onChange={(code) => setCode(code)}
// 					/>

// 					<div className='mt-4 flex space-x-3 w-full'>
// 						<Button
// 							className='bg-pry w-full capitalize text-sm flex items-center justify-center'
// 							onClick={() => handleConfirmApproval(code)}
// 							loading={loading}
// 						>
// 							Confirm Approval
// 						</Button>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default OTPApprovalModal;
