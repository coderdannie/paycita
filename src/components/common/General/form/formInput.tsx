import React from "react";
import { COLORS } from "@/constants/colors";

const FormInput = ({
	label,
	type,
	value,
	onChange,
	error,
	placeholder,
	icon,
	iconPosition,
	iconClick,
	required,
	optional,
	name,
	readOnly,
	bgColor,
	borderColor,
	borderWidth,
	color,
	inputRef,
	fontSize,
	min,
	max,
	paddingX,
	paddingY,
	className,
	id,
	requiredColor = "text-red-400",
	labelPosition = "block",
	labelGap = "gap-4",
	...rest
}: iInputField) => {
	const isLeftIcon = iconPosition === "left";

	return (
		<div
			className={`${
				labelPosition === "flex" ? `flex items-center ${labelGap}` : ""
			}`}
		>
			{label && (
				<label
					style={{ color: (error && COLORS.red_pry) || color }}
					className={`${
						labelPosition === "flex" ? "whitespace-nowrap" : "mb-2 block"
					} text-[${fontSize}] font-medium`}
				>
					{label}
					{required && <span className={`pl-1 ${requiredColor}`}>*</span>}
					{optional && <span className='text-[#787486] pl-1 '>(Optional)</span>}
				</label>
			)}

			<div className='relative flex-1'>
				{icon && (
					<span
						onClick={iconClick}
						className={`absolute ${
							isLeftIcon ? "left-0" : "right-0"
						} px-3 bottom-0 flex items-center justify-center h-full cursor-pointer`}
					>
						{icon}
					</span>
				)}
				<input
					id={id}
					type={type}
					ref={inputRef}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required={required}
					name={name}
					readOnly={readOnly}
					className={` ${className} block px-${paddingX ? paddingX : "4"} py-${
						paddingY ? paddingY : "4"
					}
          } rounded-full w-full border-[1px] ${
						error
							? "border-red_pry"
							: value
							? "border-pry border-opacity-50"
							: "dark:border-borderDark border-borderLight"
					} ${
						isLeftIcon ? "pl-12" : "pr-12"
					} dark:placeholder:text-gray_3 placeholder:text-gray_4 ${
						readOnly
							? "dark:bg-darkBg bg-lightBg"
							: bgColor
							? `bg-[${bgColor}]`
							: "bg-transparent"
					}`}
					style={{
						borderWidth,
						borderColor,
						color: (error && COLORS.red_pry) || color,
					}}
					{...rest}
				/>
			</div>
			{error && (
				<div className='mt-1' style={{ color: COLORS.red_pry }}>
					{error}
				</div>
			)}
		</div>
	);
};

export default FormInput;
