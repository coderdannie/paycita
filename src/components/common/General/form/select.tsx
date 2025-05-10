import React from "react";
import { COLORS } from "../../colors";
// import { COLORS } from "@/constants/colors";

const FormSelect = ({
	label,
	options,
	value,
	error,
	placeholder,
	onSelect,
	name,
	className,
	bgColor,
	borderWidth,
	borderColor,
	color,
	required,
	optional,
	icon,
	readOnly,
	paddingX,
	paddingY,
	fontSize,
	labelPosition = "block",
	requiredColor = "text-red-400",
	labelGap = "gap-4",
	...rest
}: iSelect) => {
	
	return (
    <div
      className={`${
        labelPosition === "flex" ? `flex items-center ${labelGap}` : ""
      }`}
    >
      {label && (
        <label
          style={{ color: color }}
          className={`${
            labelPosition === "flex" ? "whitespace-nowrap" : "mb-2 block"
          } text-${fontSize} `}
        >
          {label}{" "}
          {required && <span className={`pl-1 ${requiredColor}`}>*</span>}
          {optional && <span className="text-[#787486] pl-1 ">(Optional)</span>}
        </label>
      )}
      <div className="relative flex-1">
        {icon && (
          <span
            className={`absolute left-0 px-3 bottom-0 flex items-center justify-center h-full cursor-pointer`}
          >
            {icon}
          </span>
        )}
        <select
          value={value}
          //"@ts-expect-error"
          onChange={onSelect}
          name={name}
          disabled={readOnly}
          className={`block px-${paddingX ? paddingX : "4"} py-${
            paddingY ? paddingY : "4"
          } rounded-full w-full ${
            error
              ? "border-red_pry"
              : value
              ? "border-pry border-opacity-50"
              : "dark:border-borderDark border-borderLight"
          } dark:text-gray_3 text-gray_4 ${className} text-gray_3 ${
            icon && "pl-8"
          }`}
          style={{
            backgroundColor: bgColor ? bgColor : "transparent",
            borderWidth: borderWidth || 1,
            borderColor: borderColor,
            color: (error && COLORS.red_pry) || color,
          }}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((option, ind) => (
            <option key={ind} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {error && <div style={{ color: COLORS.red_pry }}>{error}</div>}
    </div>
  );
};

export default FormSelect;
