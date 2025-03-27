'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { IoCloseSharp } from 'react-icons/io5';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import StatusStepper from '../common/Stepper';
import { formatDate } from '@/src/utils/helper';

interface ProcurementItem {
  id: string;
  item: string;
  description: string;
  price: number;
  quantity: number;
}

interface ProcurementDetails {
  id: string;
  procurement_number: string;
  status: string;
  total_cost: number;
  created_at: string;
  expected_delivery_date?: string;
  finance_manager_status: string;
  managment_status: string;
  items: ProcurementItem[];
  vendor?: string;
}

interface ProcurementDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProcurementDetailsDrawer: React.FC<ProcurementDetailDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  // Dummy data matching your example
  const expense: ProcurementDetails = {
    id: '12345',
    procurement_number: 'PROC-2023-001',
    status: 'approved',
    total_cost: 12500.75,
    created_at: '2023-05-15T10:30:00Z',
    expected_delivery_date: '2023-06-10T00:00:00Z',
    finance_manager_status: 'approved',
    managment_status: 'approved',
    items: [
      {
        id: '1',
        item: 'Office Chairs',
        description: 'Ergonomic office chairs with lumbar support',
        price: 250.25,
        quantity: 10,
      },
      {
        id: '2',
        item: 'Desk Lamps',
        description: 'LED desk lamps with adjustable brightness',
        price: 45.5,
        quantity: 20,
      },
      {
        id: '3',
        item: 'Whiteboards',
        description: 'Large magnetic whiteboards 4x6 feet',
        price: 120.0,
        quantity: 5,
      },
    ],
    vendor: 'Office Supplies Inc.',
  };

  const orderDate = formatDate(expense.created_at);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'pending':
        return 'text-orange-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
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
            className="fixed top-0 right-0 h-full w-full max-w-[930px] bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex flex-row justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">
                  Purchase Request Details
                </h2>
                <IoCloseSharp
                  className="hover:bg-gray-100 hover:text-primary rounded-md hover:font-semibold cursor-pointer p-1"
                  size={24}
                  onClick={onClose}
                />
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-4 text-gray-600">
                {/* Summary Card */}
                <div className="bg-[#F0EAF5] p-4 flex flex-col gap-4 rounded-md border border-gray-200">
                  <div className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                      <p className="text-xl">{expense.procurement_number}</p>
                      <span
                        className={`py-1 px-2 rounded-md text-sm font-medium ${getStatusColor(
                          expense.status
                        )}`}
                      >
                        {expense.status}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold">
                      ${Number(expense.total_cost).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm">
                    {expense.items.length} Products • Order Placed on{' '}
                    {orderDate}
                  </p>
                </div>

                {/* Approval Status */}
                <div className="py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border p-3 rounded-md">
                      <p className="text-sm text-gray-500">
                        Finance Manager Status
                      </p>
                      <p
                        className={`font-medium capitalize ${getStatusColor(
                          expense.finance_manager_status
                        )}`}
                      >
                        {expense.finance_manager_status}
                      </p>
                    </div>
                    <div className="border p-3 rounded-md">
                      <p className="text-sm text-gray-500">Management Status</p>
                      <p
                        className={`font-medium capitalize ${getStatusColor(
                          expense.managment_status
                        )}`}
                      >
                        {expense.managment_status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stepper */}
                <StatusStepper currentStatus={expense.status} />

                {/* Items Table */}
                <div className="py-4">
                  <div className="py-4 border-b-2">
                    <p className="font-medium">List Items</p>
                  </div>

                  <div className="w-full bg-gray-100 mt-2">
                    <Table>
                      <TableHeader className="bg-gray-200">
                        <TableRow>
                          <TableHead className="px-4 py-2 text-left">
                            Item
                          </TableHead>
                          <TableHead className="px-4 py-2 text-left">
                            Description
                          </TableHead>
                          <TableHead className="px-4 py-2 text-right">
                            Unit Price
                          </TableHead>
                          <TableHead className="px-4 py-2 text-center">
                            Quantity
                          </TableHead>
                          <TableHead className="px-4 py-2 text-right">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expense.items.map((item) => (
                          <TableRow key={item.id} className="border-b-2">
                            <TableCell className="px-4 py-3">
                              {item.item}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {item.description}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              ${Number(item.price).toLocaleString()}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              x{item.quantity}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              $
                              {(
                                Number(item.price) * item.quantity
                              ).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Vendor */}
                {expense.vendor && (
                  <div className="mt-4">
                    <div className="py-4 border-b-2">
                      <p className="font-medium">Vendor</p>
                    </div>
                    <div className="flex flex-row gap-2 border-2 border-gray-200 p-3 rounded-md w-fit mt-2">
                      <Image
                        src="/personalcard.svg"
                        alt="vendor"
                        width={20}
                        height={20}
                      />
                      <p className="uppercase text-sm">{expense.vendor}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <button
                  className="bg-primary hover:bg-primary-dark text-white px-14 py-3 rounded-md capitalize w-full sm:w-auto"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProcurementDetailsDrawer;
