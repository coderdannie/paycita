"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

// Define the asset schema with Zod
const assetSchema = z.object({
  name: z.string().min(1, { message: "Asset name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  quantity: z
    .string()
    .min(1, { message: "Quantity is required" })
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "Quantity must be a positive number",
    }),
  status: z.enum(["In Stock", "Out of Stock", "On Order"], {
    required_error: "Status is required",
  }),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (asset: AssetFormValues) => void;
}

export const AddAssetModal = ({
  isOpen,
  onClose,
  onAddAsset,
}: AddAssetModalProps) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize React Hook Form
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      category: "Laptops",
      quantity: "",
      status: "In Stock",
    },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const onSubmit = (values: AssetFormValues) => {
    // Create a properly typed asset object before passing to onAddAsset
    onAddAsset({
      ...values
    });

    form.reset();
    onClose();
  };

  const getStatusStyles = (statusValue: string) => {
    switch (statusValue) {
      case "In Stock":
        return "border border-[#89D8A9] text-[#00AA4F]";
      case "Out of Stock":
        return "border border-red-500 text-red-600";
      case "On Order":
        return "border border-yellow-500 text-yellow-600";
      default:
        return "border border-green-500 text-green-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Asset</h2>
          <button
            onClick={onClose}
            className="text-[#6C6F75] hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#1D2939] mb-1">
                    Asset Name
                  </FormLabel>
                  <FormControl>
                    <input
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter asset name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#1D2939] mb-1">
                    Category
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        className="appearance-none w-full px-3 py-2 border rounded-md pr-10"
                        {...field}
                      >
                        <option value="Laptops">Laptops</option>
                        <option value="Phones">Phones</option>
                        <option value="Monitors">Monitors</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#1D2939] mb-1">
                    Quantity
                  </FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter quantity"
                      min="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#1D2939] mb-1">
                    Status
                  </FormLabel>
                  <div className="relative" ref={dropdownRef}>
                    <FormControl>
                      <div
                        className="border rounded-md p-2 flex items-center justify-between cursor-pointer"
                        onClick={() =>
                          setStatusDropdownOpen(!statusDropdownOpen)
                        }
                      >
                        <div
                          className={`px-1 py-1 rounded ${getStatusStyles(
                            field.value
                          )}`}
                        >
                          {field.value}
                        </div>

                        <div className="flex items-center px-2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    {statusDropdownOpen && (
                      <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                        {["In Stock", "Out of Stock", "On Order"].map(
                          (status) => (
                            <div
                              key={status}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                field.onChange(status);
                                setStatusDropdownOpen(false);
                              }}
                            >
                              {status}
                            </div>
                          )
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
                className="flex-1 px-4 py-2 border border-[#344054] rounded-md text-[#344054] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800"
              >
                Save Asset
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
