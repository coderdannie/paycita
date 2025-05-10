import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

interface PhoneInputProps {
  value: string;
  setValue: (value: string) => void;
  color?: string;
  bgColor?: string;
  showLabel?: boolean;
  fontSize?: string;
  className?: string;
  label?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInputComponent = React.forwardRef<
  HTMLInputElement,
  CustomInputProps
>((props, ref) => {
  const isInvalid = !props.value || !isValidPhoneNumber(props.value);

  return (
    <input
      {...props}
      ref={ref}
      className={`w-full px-3 py-2 bg-transparent focus:outline-none text-black ml-2 ${
        isInvalid ? "border-[#F1F1F1]" : "border-white "
      } text-base`}
    />
  );
});

// Set the display name for CustomInputComponent
CustomInputComponent.displayName = "CustomInputComponent";

const PhoneInputComponent = ({
  value,
  setValue,
  color,
  bgColor,
  showLabel = true,
  fontSize,
  className,
  label,
  required,
  onChange,
}: PhoneInputProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(label || showLabel) && (
        <label
          htmlFor="mobile_number"
          className={`text-[${fontSize ? fontSize : "12"}] text-[474A4E] pb-1`}
          style={{ color: color }}
        >
          {label} {required && <span className="text-red_pry">*</span>}
        </label>
      )}
      <span
        className={`block ${
          !value || !isValidPhoneNumber(value)
            ? bgColor
              ? `border-[#F1F1F1] bg-[${bgColor}]`
              : "border-[#F1F1F1] bg-white"
            : "border-[#FFD68F] bg-[#FEFAF4] bg-opacity-10"
        }  w-full p-1 px-3 rounded-full border-[2px]`}
      >
        <PhoneInput
          placeholder="Enter phone number"
          value={value}
          onChange={(val) => {
            setValue(val!);
            if (val && onChange) onChange(val);
          }}
          international
          defaultCountry="NG"
          id="mobile_number"
          inputComponent={CustomInputComponent}
        />
      </span>
    </div>
  );
};

export default PhoneInputComponent;
