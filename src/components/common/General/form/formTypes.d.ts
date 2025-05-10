interface iOTP {
	OTP: string;
	setOTP: Dispatch<string>;
	length?: number;
	width?: any;
	height?: any;
	textColor?: string;
	bgColor?: string;
	borderWidth?: number;
	borderColor?: string;
	inputType?: "text" | "password" | "tel" | "number";
}

interface iFormProps {
	label?: string;
	value?: string | number;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	error?: any;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	required?: boolean;
	requiredColor?: string;
	optional?: boolean;
	name?: string;
	readOnly?: boolean;
	bgColor?: string;
	borderWidth?: number;
	borderColor?: string;
	className?: string;
	color?: string;
	inputRef?: any;
	fontSize?: string;
	min?: number;
	max?: number;
	paddingX?: string;
	paddingY?: string;
	labelPosition?: "block" | "flex";
	id?: string;
}

interface iInputField extends iFormProps {
	icon?: ReactNode;
	iconPosition?: "right" | "left";
	labelPosition?: "block" | "flex";
	iconClick?: () => void;
	labelGap?: string;
}

interface iCheckForm extends iFormProps {
	checked?: boolean;
	setChecked?: any;
	callback?: () => void;
}

interface iSelect extends iFormProps {
	onSelect?: ChangeEventHandler<HTMLSelectElement>;
	options: string[];
	icon?: ReactNode;
	labelPosition?: "flex" | "block";
	labelGap?: string;
}

interface CountryOption {
	value: string;
	label: string;
	flag: string;
}
