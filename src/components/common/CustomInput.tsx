import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { FaEye } from 'react-icons/fa';
import { BiHide } from 'react-icons/bi';

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
  error,
  icon,
  value,
  readOnly = false,
  label,
  textarea = false, // Default to false
  rows = 3, // Default rows for textarea
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
                  className={`w-full p-2 border-2  text-sm  text-[#1D2939] bg-white
                    ${error ? 'border-red-500' : 'border-[#E4E7EC]'}
                    focus:outline-none focus:border-transparent focus:ring-0 
                    focus-visible:ring-0 focus-visible:border-transparent rounded-[9px] resize-y`}
                />
              ) : (
                <Input
                  {...field}
                  id={name}
                  type={
                    isPassword ? (showPassword ? 'text' : 'password') : 'text'
                  }
                  value={value}
                  placeholder={placeholder}
                  onChange={(e) => {
                    field.onChange(e); // React Hook Form's handler
                    onChange?.(e); // Custom handler, if provided
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  readOnly={readOnly}
                  className={`w-full border-2 h-[40px] text-[#34006A] bg-white
                    ${error ? 'border-red-500' : 'border-[#E4E7EC]'}
                    focus:outline-none focus:border-transparent focus:ring-0 
                    focus-visible:ring-0 focus-visible:border-transparent rounded-[9px]`}
                />
              )}
              {isPassword && showPasswordToggle && !textarea && (
                <div
                  className="absolute right-2 text-lg top-5 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaEye color="#4F4F4F" />
                  ) : (
                    <BiHide color="#4F4F4F" />
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage>{error}</FormMessage>
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
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize font-semibold text-sm text-[#1D2939]">
            {labelText || String(name)}
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                className={`   bg-white ${
                  error ? 'border-red-500' : 'border-[#E4E7EC]'
                }`} // Apply error styling
              >
                <SelectValue placeholder={holder || String(name)} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {items.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage>{error}</FormMessage>
        </FormItem>
      )}
    />
  );
}
