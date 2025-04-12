import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { FaEye } from "react-icons/fa";
import { BiHide } from "react-icons/bi";

type CustomFormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control?: Control<T>;
  showPasswordToggle?: boolean;
  isPassword?: boolean;
  placeholder?: string;
  value?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
  label?: string;
  textarea?: boolean; // Add textarea prop
  rows?: number; // Add rows prop for textarea
  auth?: boolean; // Add auth prop
};

export function CustomFormField<T extends FieldValues>({
  name,
  control,
  showPasswordToggle = false,
  isPassword = false,
  placeholder,
  onFocus,
  onBlur,
  onChange,
  error, // Error prop for validation messages
  icon,
  // value,
  readOnly = false,
  label,
  textarea = false,
  rows = 3,
  auth = false,
}: CustomFormFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              htmlFor={name}
              className="capitalize font-semibold text-sm text-[#1D2939]"
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  {icon}
                </div>
              )}
              {textarea ? (
                <textarea
                  {...field}
                  id={name}
                  placeholder={placeholder}
                  onChange={(e) => {
                    field.onChange(e); // React Hook Form's handler
                    onChange?.(e); // Custom handler, if provided
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  readOnly={readOnly}
                  rows={rows}
                  className={`w-full p-2 border-2 text-sm text-[#1D2939] bg-white
                    ${
                      error
                        ? "border-red-500"
                        : auth
                        ? "border-[#34006A]"
                        : "border-[#E4E7EC]"
                    }
                    focus:outline-none focus:ring-0 
                    focus-visible:ring-0 ${
                      auth ? "rounded-[123px]" : "rounded-[9px]"
                    } resize-y`}
                />
              ) : (
                <Input
                  {...field}
                  id={name}
                  type={
                    isPassword ? (showPassword ? "text" : "password") : "text"
                  }
                  // value={value}
                  placeholder={placeholder}
                  onChange={(e) => {
                    field.onChange(e); // React Hook Form's handler
                    onChange?.(e); // Custom handler, if provided
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  readOnly={readOnly}
                  className={`w-full border-2 text-[#34006A] bg-white
                    ${
                      error
                        ? "border-red-500"
                        : auth
                        ? "border-[#CBD5E1]"
                        : "border-[#E4E7EC]"
                    }
                    ${auth ? "h-[48px]" : "h-[40px]"}
                    focus:outline-none focus:ring-0 
                    focus-visible:ring-0 ${
                      auth ? "rounded-[123px]" : "rounded-[9px]"
                    }`}
                />
              )}
              {isPassword && showPasswordToggle && !textarea && (
                <div
                  className="absolute right-2 text-lg top-4 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaEye color="#CBD5E1" />
                  ) : (
                    <BiHide color="#CBD5E1" />
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-red-500">{error}</FormMessage>{" "}
          {/* Display error message */}
        </FormItem>
      )}
    />
  );
}

type CustomFormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  items: string[];
  labelText?: string;
  error?: string;
  holder?: string;
};

export function CustomFormSelect<T extends FieldValues>({
  name,
  control,
  items,
  labelText,
  error,
  holder,
}: CustomFormSelectProps<T>) {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="capitalize font-semibold text-sm text-[#1D2939]">
              {labelText || String(name)}
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger
                  className={`bg-white ${
                    error ? "border-red-500" : "border-[#E4E7EC]"
                  }`} // Apply error styling
                >
                  <SelectValue placeholder={holder || String(name)} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {Array.isArray(items) &&
                    items?.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="text-red-500">{error}</FormMessage>
          </FormItem>
        )}
      />
    </>
  );
}
