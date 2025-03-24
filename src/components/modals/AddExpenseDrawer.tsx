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

interface ExpenseItem {
  id: string;
  item: string | null;
  description: string;
  qty: number | '';
  unitPrice: number | '';
}

interface ExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddExpenseDrawer: React.FC<ExpenseDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<ExpenseItem[]>([
    {
      id: crypto.randomUUID(),
      item: null,
      description: '',
      qty: '',
      unitPrice: '',
    },
  ]);

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
              <h2 className="text-lg font-semibold">Add Expense</h2>
              <button onClick={onClose}>
                <IoClose className="text-2xl text-[#667085]" />
              </button>
            </div>

            <div className="mt-[30px] overflow-x-auto relative">
              <div className="min-h-[276px] border border-[#E4E7EC] rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#F9FAFB]">
                    <TableRow className="text-[#1D2939] font-semibold">
                      <TableHead className="w-[30%]">Item</TableHead>
                      <TableHead className="w-[30%]">Description</TableHead>
                      <TableHead className="w-[10%] text-center">Qty</TableHead>
                      <TableHead className="w-[10%] text-center">
                        Unit Price
                      </TableHead>
                      <TableHead className="w-[10%] text-center">
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

                {/* Total Sum Row */}
                <div className="flex justify-end p-4 absolute bottom-0 right-0">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold">₦ {totalSum.toFixed(2)}</span>
                  </div>
                </div>

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

export default AddExpenseDrawer;
