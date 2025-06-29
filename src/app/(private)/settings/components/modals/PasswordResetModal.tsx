import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { FiX, FiCheck } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useChangePassword } from "@/src/hooks/settings/useSettings";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

// Enhanced password validation schema
const passwordResetSchema = z
  .object({
    old_password: z.string().min(8, {
      message: "Old password must be at least 8 characters.",
    }),
    new_password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirm_password: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const { mutate: mutateChangePassword, isPending } = useChangePassword();
  const newPassword = useWatch({
    control: form.control,
    name: "new_password",
  });

  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });

  useEffect(() => {
    if (!newPassword) {
      setPasswordValidation({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
      return;
    }

    setPasswordValidation({
      minLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[^A-Za-z0-9]/.test(newPassword),
    });
  }, [newPassword]);

  const onSubmit = async (data: PasswordResetFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, ...payload } = data;

    mutateChangePassword(
      payload as {
        old_password: string;
        new_password: string;
      },
      {
        onSuccess: (res) => {
          toast.success(res.data.message);
          form.reset();
          onClose();
        },
        onError: (error) => {
          toast.error(error.message);

        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Reset Password
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <p className="mb-4 text-sm text-gray-600">
              Reset your account password
            </p>
            <div className="mb-4 text-sm text-gray-600">
              <p>Password requirements:</p>
              <ul className="space-y-1 mt-1">
                <li className="flex items-center">
                  {passwordValidation.minLength ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <span className="w-5 mr-2"></span>
                  )}
                  Minimum 8 characters
                </li>
                <li className="flex items-center">
                  {passwordValidation.hasUpperCase ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <span className="w-5 mr-2"></span>
                  )}
                  At least one uppercase letter (A-Z)
                </li>
                <li className="flex items-center">
                  {passwordValidation.hasLowerCase ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <span className="w-5 mr-2"></span>
                  )}
                  At least one lowercase letter (a-z)
                </li>
                <li className="flex items-center">
                  {passwordValidation.hasNumber ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <span className="w-5 mr-2"></span>
                  )}
                  At least one number (0-9)
                </li>
                <li className="flex items-center">
                  {passwordValidation.hasSpecialChar ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <span className="w-5 mr-2"></span>
                  )}
                  At least one special character
                </li>
              </ul>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="old_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your old password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Updating..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
