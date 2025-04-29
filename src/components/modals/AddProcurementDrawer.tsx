import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoTrashBin } from 'react-icons/io5';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { formatDate } from '@/src/utils/helper';
import Calendar from 'react-calendar';
import { FiCalendar } from 'react-icons/fi';
import { TileArgs } from 'react-calendar';
import { expenseHeaders } from '../common/constants';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { ProcurementForm, procurementSchema } from '@/src/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateProcurements,
  useGetVendors,
} from '@/src/hooks/procurement/useProcurement';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Procurement, ProcurementData } from '@/src/types/procurement';
import { Spinner } from 'react-activity';
import { useGetExpenseTypes } from '@/src/hooks/expenses/useExpenses';

interface ProcurementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  procurement: ProcurementData;
  isEditing: boolean;
}

type CalendarTileArgs = TileArgs & {
  view: 'month' | 'year' | 'decade' | 'century';
};

const AddProcurement: React.FC<ProcurementDrawerProps> = ({
  isOpen,
  onClose,
  procurement,
  isEditing,
}) => {
  const { expenseType } = useGetExpenseTypes();
  const { vendors } = useGetVendors();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
    trigger,
    reset,
  } = useForm<ProcurementForm>({
    resolver: zodResolver(procurementSchema),
    defaultValues: {
      procurement_date:
        isEditing && procurement.created_at
          ? new Date(procurement.created_at)
          : null,
      expected_delivery_date:
        isEditing && procurement.expected_delivery_date
          ? new Date(procurement.expected_delivery_date)
          : null,
      vendor_id: isEditing ? procurement.vendor : '',
      details:
        isEditing && procurement.items
          ? procurement.items.map((item) => ({
              id: crypto.randomUUID(),
              item: item.item,
              description: item.description,
              quantity: item.quantity.toString(),
              price: item.price.toString(),
              total: Number(item.price) * item.quantity,
            }))
          : [
              {
                id: crypto.randomUUID(),
                item: '',
                description: '',
                quantity: '',
                price: '',
                total: 0,
              },
            ],
    },
  });

  // Reset form when procurement changes (for edit mode)
  useEffect(() => {
    if (isEditing && procurement) {
      reset({
        procurement_date: procurement?.created_at
          ? new Date(procurement?.created_at)
          : null,
        expected_delivery_date: procurement?.expected_delivery_date
          ? new Date(procurement?.expected_delivery_date)
          : null,
        vendor_id: procurement?.vendor,
        details: procurement?.items?.map((item) => ({
          id: crypto.randomUUID(),
          item: item.item,
          description: item.description,
          quantity: item.quantity.toString(),
          price: item.price.toString(),
          total: Number(item.price) * item.quantity,
        })),
      });
    } else {
      reset({
        procurement_date: null,
        expected_delivery_date: null,
        vendor_id: '',
        details: [
          {
            id: crypto.randomUUID(),
            item: '',
            description: '',
            quantity: '',
            price: '',
            total: 0,
          },
        ],
      });
    }
  }, [procurement, isEditing, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const [showProcurementCalendar, setShowProcurementCalendar] = useState(false);
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);

  const procurement_date = watch('procurement_date');
  const expected_delivery_date = watch('expected_delivery_date');
  const itemsArray = watch('details');

  const handleProcurementDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setValue('procurement_date', value);
      setShowProcurementCalendar(false);
      clearErrors('procurement_date');
    }
  };

  const handleExpectedDeliveryDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setValue('expected_delivery_date', value);
      setShowDeliveryCalendar(false);
      clearErrors('expected_delivery_date');
    }
  };

  // Date restriction functions
  const disablePastProcurementDates = ({
    date,
    view,
  }: CalendarTileArgs): boolean => {
    if (view !== 'month') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const disableDeliveryBeforeProcurement = ({
    date,
    view,
  }: CalendarTileArgs): boolean => {
    if (view !== 'month' || !procurement_date) return false;
    const minDate = new Date(procurement_date);
    minDate.setHours(0, 0, 0, 0);
    return date < minDate;
  };

  const tileClassName = ({ date, view }: CalendarTileArgs): string | null => {
    if (view !== 'month') return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // For weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      return 'disabled-date';
    }

    // For past dates
    if (date < today) {
      return 'disabled-date';
    }

    return null;
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const calculateTotal = (
    quantity: number | string | undefined,
    price: number | string | undefined
  ) => {
    const qty =
      quantity === undefined || quantity === '' ? 0 : Number(quantity);
    const prc = price === undefined || price === '' ? 0 : Number(price);
    return (qty * prc).toFixed(2);
  };

  const procuredItems = useWatch({ control, name: 'details' });

  useEffect(() => {
    procuredItems?.forEach((item, index) => {
      const quantity = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      const total = quantity * price;

      if (item?.total !== total) {
        setValue(`details.${index}.total`, total);
      }
    });
  }, [procuredItems, setValue]);

  const totalSum = useMemo(() => {
    return procuredItems?.reduce((sum, item) => {
      const quantity = item.quantity === '' ? 0 : Number(item.quantity);
      const price = item.price === '' ? 0 : Number(item.price);
      return sum + quantity * price;
    }, 0);
  }, [procuredItems]);

  const handleAddItem = async () => {
    const lastIndex = fields.length - 1;
    const isValid = await trigger(`details.${lastIndex}`);

    if (!isValid) return;

    append({
      id: crypto.randomUUID(),
      item: '',
      description: '',
      quantity: '',
      price: '',
      total: 0,
    });
  };

  const { mutate: mutateCreateProcurements, isPending } =
    useCreateProcurements();

  const onSubmit = (data: ProcurementForm) => {
    const procurements = data.details.map((item) => ({
      item: item.item,
      description: item.description,
      quantity: item.quantity,
      price: item.price.toString(),
    }));

    const payload = {
      ...data,
      details: procurements,
      total_price: totalSum.toString(),
      procurement_date: formatDate(data.procurement_date),
      expected_delivery_date: formatDate(data.expected_delivery_date),
    } as Procurement;

    mutateCreateProcurements(payload, {
      onSuccess: (res) => {
        toast.success(res.data.message || 'Procurement created successfully');
        reset();
        onClose();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.message || 'Failed to update event';
          toast.error(errorMessage);
        }
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full bg-black z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-[930px] bg-white shadow-xl z-50 rounded-lg p-4"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between border-b border-[#E4E7EC] py-3 ">
                <h2 className="text-lg font-semibold">
                  {isEditing ? 'Edit Procurement' : 'New Procurement Request'}
                </h2>
                <button onClick={onClose} type="button">
                  <IoClose className="text-2xl text-[#667085]" />
                </button>
              </div>
              <div className="space-y-6 border border-gray-300 p-3 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex gap-5">
                    <span>Procurement Details</span>
                  </div>
                  <div>
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold">₦ {totalSum.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                  {/* Procurement Date */}
                  <div className="w-full space-y-1">
                    <p>Procurement Date</p>
                    <div className="w-full relative">
                      <div>
                        <div
                          className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                            procurement_date ? 'justify-between' : 'justify-end'
                          } items-center p-[10px]`}
                          onClick={() => {
                            setShowProcurementCalendar((prev) => !prev);
                            setShowDeliveryCalendar(false);
                          }}
                        >
                          <p className="text-sm text-[#292D32]">
                            {procurement_date
                              ? formatDate(procurement_date)
                              : 'Select date'}
                          </p>
                          <div>
                            <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                          </div>
                        </div>
                        {errors.procurement_date && (
                          <p className="text-red-500 text-sm">
                            Procurement date is required
                          </p>
                        )}
                      </div>

                      {showProcurementCalendar && (
                        <div className="absolute max-w-[350px] mt-2 w-full z-30">
                          <Calendar
                            onChange={handleProcurementDateChange}
                            value={procurement_date || new Date()}
                            minDate={new Date()}
                            tileDisabled={disablePastProcurementDates}
                            tileClassName={tileClassName}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expected Delivery Date */}
                  <div className="w-full space-y-1">
                    <p>Expected Delivery</p>
                    <div className="w-full relative">
                      <div
                        className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                          expected_delivery_date
                            ? 'justify-between'
                            : 'justify-end'
                        } items-center p-[10px]`}
                        onClick={() => {
                          setShowDeliveryCalendar((prev) => !prev);
                          setShowProcurementCalendar(false);
                        }}
                      >
                        <p className="text-sm text-[#292D32]">
                          {expected_delivery_date
                            ? formatDate(expected_delivery_date)
                            : 'Select date'}
                        </p>
                        <div>
                          <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                        </div>
                      </div>

                      {showDeliveryCalendar && (
                        <div className="absolute max-w-[350px] mt-2 w-full z-30">
                          <Calendar
                            onChange={handleExpectedDeliveryDateChange}
                            value={
                              expected_delivery_date ||
                              (procurement_date
                                ? new Date(procurement_date)
                                : new Date())
                            }
                            minDate={procurement_date || new Date()}
                            tileDisabled={disableDeliveryBeforeProcurement}
                            tileClassName={tileClassName}
                          />
                        </div>
                      )}
                    </div>
                    {errors.expected_delivery_date && (
                      <p className="text-red-500 text-sm">
                        {errors.expected_delivery_date.message?.toString()}
                      </p>
                    )}
                  </div>

                  {/* Vendor Selection */}
                  <div className="w-full space-y-1">
                    <p>Vendor</p>
                    <Controller
                      name="vendor_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            {vendors.map(
                              (vendor: { id: number; vendor_name: string }) => (
                                <SelectItem
                                  key={vendor.id}
                                  value={vendor.id.toString()}
                                >
                                  {vendor.vendor_name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.vendor_id && (
                      <p className="text-red-500 text-sm">
                        {errors.vendor_id.message?.toString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-[30px] overflow-x-auto relative">
                <div className="min-h-[276px] border border-[#E4E7EC] rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#F9FAFB]">
                      <TableRow>
                        {expenseHeaders.map((dat, i) => (
                          <TableHead
                            key={i}
                            className="min-w-[100px] md:min-w-0 text-[#1D2939] font-semibold"
                          >
                            {dat}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="mt-4">
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell className="w-[30%]">
                            <Controller
                              name={`details.${index}.item`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="h-[40px]">
                                      <SelectValue placeholder="Select item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {expenseType.map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          value={item.name}
                                        >
                                          {item.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {errors.details?.[index]?.item && (
                                    <p className="text-red-500 text-sm">
                                      {errors.details[index].item?.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                          </TableCell>
                          <TableCell className="w-[30%]">
                            <Controller
                              name={`details.${index}.description`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    {...field}
                                    type="text"
                                    className="border border-gray-300 h-[40px] w-full rounded p-2"
                                  />
                                  {errors.details?.[index]?.description && (
                                    <p className="text-red-500 text-sm">
                                      {
                                        errors.details[index].description
                                          ?.message
                                      }
                                    </p>
                                  )}
                                </>
                              )}
                            />
                          </TableCell>
                          <TableCell className="w-[10%]">
                            <Controller
                              name={`details.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    {...field}
                                    type="number"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value === '' ? '' : parseInt(value) || 0
                                      );
                                    }}
                                    className="border border-gray-300 h-[40px] w-full rounded p-2 text-center"
                                  />
                                  {errors.details?.[index]?.quantity && (
                                    <p className="text-red-500 text-sm">
                                      {errors.details[index].quantity?.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                          </TableCell>
                          <TableCell className="w-[10%]">
                            <Controller
                              name={`details.${index}.price`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    {...field}
                                    type="number"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value === ''
                                          ? ''
                                          : parseFloat(value) || 0
                                      );
                                    }}
                                    className="border border-gray-300 h-[40px] w-full rounded p-2 text-center"
                                  />
                                  {errors.details?.[index]?.price && (
                                    <p className="text-red-500 text-sm">
                                      {errors.details[index].price?.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                          </TableCell>
                          <TableCell className="w-[10%] text-center">
                            ₦{' '}
                            {calculateTotal(
                              itemsArray[index]?.quantity,
                              itemsArray[index]?.price
                            )}
                          </TableCell>
                          <TableCell className="w-[10%] text-center">
                            <button
                              onClick={() => remove(index)}
                              className="text-red-500"
                              type="button"
                            >
                              <IoTrashBin />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <button
                    onClick={handleAddItem}
                    type="button"
                    className="mt-4 ml-3 bg-[#F4F5F6] p-[10px] font-semibold rounded-md text-sm text-[#344054]"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
              <div className="flex gap-4 h-[40px] absolute bottom-0 right-0 mb-5 mr-5">
                <button
                  type="button"
                  className="h-full font-semibold text-primary border border-primary px-[30px] text-sm rounded-lg"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-[30px] flex items-center justify-center gap-3"
                  disabled={isPending}
                >
                  {isPending && <Spinner />}
                  {isEditing ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddProcurement;
