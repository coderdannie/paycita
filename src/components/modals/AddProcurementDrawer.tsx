import React, { useState, useEffect, useMemo } from 'react';
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

interface ProcurementItem {
  id: string;
  item: string | null;
  description: string;
  qty: number | '';
  unitPrice: number | '';
}

interface ProcurementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type CalendarTileArgs = TileArgs & {
  view: 'month' | 'year' | 'decade' | 'century';
};

const vendors = [
  { id: 1, vendor_name: 'Acme Corporation', category: 'Electronics' },
  { id: 2, vendor_name: 'Globex Inc', category: 'Office Supplies' },
  { id: 3, vendor_name: 'Wayne Enterprises', category: 'Security' },
  { id: 4, vendor_name: 'Stark Industries', category: 'Technology' },
  { id: 5, vendor_name: 'Cyberdyne Systems', category: 'Robotics' },
];

const AddProcurement: React.FC<ProcurementDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [procurementDate, setProcurementDate] = useState<Date | null>(null);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<Date | null>(
    null
  );
  const [showProcurementCalendar, setShowProcurementCalendar] = useState(false);
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);

  const handleProcurementDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setProcurementDate(value);
      setShowProcurementCalendar(false);
    }
  };

  const handleExpectedDeliveryDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setExpectedDeliveryDate(value);
      setShowDeliveryCalendar(false);
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
    if (view !== 'month' || !procurementDate) return false;
    const minDate = new Date(procurementDate);
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

  const [data, setData] = useState<ProcurementItem[]>([
    {
      id: crypto.randomUUID(),
      item: null,
      description: '',
      qty: '',
      unitPrice: '',
    },
  ]);

  const [selectedVendor, setSelectedVendor] = useState('');

  const handleVendorChange = (value: string) => {
    setSelectedVendor(value);
  };

  // Calculate total sum using useMemo for performance optimization
  const totalSum = useMemo(() => {
    return data.reduce((sum, item) => {
      const qty = item.qty === '' ? 0 : Number(item.qty);
      const unitPrice = item.unitPrice === '' ? 0 : Number(item.unitPrice);
      return sum + qty * unitPrice;
    }, 0);
  }, [data]);

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

  const handleAddItem = () => {
    setData([
      ...data,
      {
        id: crypto.randomUUID(),
        item: null,
        description: '',
        qty: '',
        unitPrice: '',
      },
    ]);
  };

  const handleDeleteItem = (id: string) => {
    setData(data.filter((item) => item.id !== id));
  };

  const calculateTotal = (qty: number | '', unitPrice: number | '') => {
    if (qty === '' || unitPrice === '') return '0.00';
    return (Number(qty) * Number(unitPrice)).toFixed(2);
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
            <div className="flex items-center justify-between border-b border-[#E4E7EC] py-3 ">
              <h2 className="text-lg font-semibold">New Procurement Request</h2>
              <button onClick={onClose}>
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
                    <div
                      className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                        procurementDate ? 'justify-between' : 'justify-end'
                      } items-center p-[10px]`}
                      onClick={() => {
                        setShowProcurementCalendar((prev) => !prev);
                        setShowDeliveryCalendar(false);
                      }}
                    >
                      <p className="text-sm text-[#292D32]">
                        {procurementDate
                          ? formatDate(procurementDate)
                          : 'Select date'}
                      </p>
                      <div>
                        <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                      </div>
                    </div>

                    {showProcurementCalendar && (
                      <div className="absolute max-w-[350px] mt-2 w-full z-30">
                        <Calendar
                          onChange={handleProcurementDateChange}
                          value={procurementDate || new Date()}
                          minDate={new Date()} // Can't select dates before today
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
                        expectedDeliveryDate ? 'justify-between' : 'justify-end'
                      } items-center p-[10px]`}
                      onClick={() => {
                        setShowDeliveryCalendar((prev) => !prev);
                        setShowProcurementCalendar(false);
                      }}
                    >
                      <p className="text-sm text-[#292D32]">
                        {expectedDeliveryDate
                          ? formatDate(expectedDeliveryDate)
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
                            expectedDeliveryDate ||
                            (procurementDate
                              ? new Date(procurementDate)
                              : new Date())
                          }
                          minDate={procurementDate || new Date()}
                          tileDisabled={disableDeliveryBeforeProcurement}
                          tileClassName={tileClassName}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Selection */}
                <div className="w-full space-y-1">
                  <p>Vendor</p>
                  <Select
                    value={selectedVendor}
                    onValueChange={handleVendorChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem
                          key={vendor.id}
                          value={vendor.id.toString()}
                        >
                          {vendor.vendor_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-[30px] overflow-x-auto relative">
              <div className="min-h-[276px] border border-[#E4E7EC] rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#F9FAFB]">
                    <TableRow>
                      <TableHead className="w-[30%] text-[#1D2939] font-semibold">
                        Item
                      </TableHead>
                      <TableHead className="w-[30%] text-[#1D2939] font-semibold text-center">
                        Description
                      </TableHead>
                      <TableHead className="w-[10%] text-[#1D2939] font-semibold text-center">
                        Qty
                      </TableHead>
                      <TableHead className="w-[10%] text-[#1D2939] font-semibold text-center">
                        Unit Price
                      </TableHead>
                      <TableHead className="w-[10%] text-center text-[#1D2939] font-semibold">
                        Total Cost
                      </TableHead>
                      <TableHead className="w-[10%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="mt-4">
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="w-[30%]">
                          <Select
                            value={item.item || ''}
                            onValueChange={(value) => {
                              setData(
                                data.map((i) =>
                                  i.id === item.id ? { ...i, item: value } : i
                                )
                              );
                            }}
                          >
                            <SelectTrigger className="h-[40px]">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="item1">Item 1</SelectItem>
                              <SelectItem value="item2">Item 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="w-[30%]">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              setData(
                                data.map((i) =>
                                  i.id === item.id
                                    ? { ...i, description: e.target.value }
                                    : i
                                )
                              );
                            }}
                            className="border border-gray-300 h-[40px] w-full rounded p-2"
                          />
                        </TableCell>
                        <TableCell className="w-[10%]">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => {
                              const value = e.target.value;
                              setData(
                                data.map((i) =>
                                  i.id === item.id
                                    ? {
                                        ...i,
                                        qty:
                                          value === ''
                                            ? ''
                                            : parseInt(value) || 0,
                                      }
                                    : i
                                )
                              );
                            }}
                            className="border border-gray-300 h-[40px] w-full rounded p-2 text-center"
                          />
                        </TableCell>
                        <TableCell className="w-[10%]">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const value = e.target.value;
                              setData(
                                data.map((i) =>
                                  i.id === item.id
                                    ? {
                                        ...i,
                                        unitPrice:
                                          value === ''
                                            ? ''
                                            : parseFloat(value) || 0,
                                      }
                                    : i
                                )
                              );
                            }}
                            className="border border-gray-300 h-[40px] w-full rounded p-2 text-center"
                          />
                        </TableCell>
                        <TableCell className="w-[10%] text-center">
                          ₦ {calculateTotal(item.qty, item.unitPrice)}
                        </TableCell>
                        <TableCell className="w-[10%] text-center">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500"
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
                  className="mt-4 ml-3 bg-[#F4F5F6] p-[10px] font-semibold rounded-md text-sm text-[#344054]"
                >
                  + Add Item
                </button>
              </div>
            </div>
            <div className="flex gap-4  h-[40px] absolute bottom-0 right-0 mb-5 mr-5">
              <button
                type="button"
                className="h-full  font-semibold text-primary border border-primary px-[30px] text-sm rounded-lg"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className={`btn-primary px-[30px]`}>Submit</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddProcurement;
