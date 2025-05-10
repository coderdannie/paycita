import React from "react";
import { Select, Option } from "@material-tailwind/react";

interface DropdownCompProps {
  options: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  placeholder: string;
}

const DropdownComp: React.FC<DropdownCompProps> = ({
  options,
  selectedValue,
  setSelectedValue,
  placeholder,
}) => {
  const handleChange = (value: string | undefined) => {
    if (value) {
      setSelectedValue(value);
    }
  };

  return (
    <div className="w-32">
      <Select
        value={selectedValue}
        onChange={handleChange}
        placeholder={placeholder}
        // label={placeholder}
        className="rounded-md p-2 border-[1px] pl-12 w-full bg-transparent border-borderLight dark:border-borderDark"
      >
        {options.map((option, index) => (
          <Option key={index} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default DropdownComp;
