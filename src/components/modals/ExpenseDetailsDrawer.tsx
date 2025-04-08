"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import StatusStepper from "../common/Stepper";
import { useAuthSelector } from "@/src/Redux/selectors";

interface ExpenseItem {
  id: string;
  item: string;
  description: string;
  price: number;
  quantity: number;
}

interface ExpenseDetails {
  id: string;
  procurement_number: string;
  status: string;
  total_cost: number;
  created_at: string;
  expected_delivery_date?: string;
  items: ExpenseItem[];
  description?: string;
}

interface ExpenseMgtDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseDetails;
}

const ExpenseMgtDetailDrawer: React.FC<ExpenseMgtDetailDrawerProps> = ({
  isOpen,
  onClose,
  expense,
}) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || "NGN";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const orderDate = formatDate(expense.created_at);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "pending":
        return "text-orange-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
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
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full bg-black z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 overflow-y-auto rounded-tl-xl rounded-bl-xl  right-0 h-full w-full px-5 max-w-[573px] bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex flex-row justify-between items-center p-4 ">
                <h2 className="text-lg font-medium">Expense Details</h2>
                <IoCloseSharp
                  className="hover:bg-gray-100 hover:text-primary rounded-md hover:font-semibold cursor-pointer p-1"
                  size={24}
                  onClick={onClose}
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 text-gray-600">
                {/* Summary Card */}
                <div className="bg-[#F0EAF5] mb-6 border border-[#9B73BF] p-4 flex flex-col gap-4 rounded-md ">
                  <div className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                      <p className="text-xl text-[#344054] font-medium">
                        {expense.procurement_number}
                      </p>
                      <div
                        className={`border-2 rounded-md bg-white ${
                          expense.status === "approved"
                            ? "border-green-400"
                            : expense.status === "pending"
                            ? "border-[#FFD384]"
                            : "border-red-600"
                        }`}
                      >
                        <span
                          className={`py-1 px-2 rounded-md text-sm font-medium capitalize ${getStatusColor(
                            expense.status
                          )}`}
                        >
                          {expense.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold">
                      {currency}
                      {Number(expense.total_cost).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm">
                    {expense?.items?.length} Products • Order Placed on{" "}
                    {orderDate}
                  </p>
                </div>

                {/* Stepper */}
                <StatusStepper currentStatus={expense?.status} />

                {/* Items Table */}
                <div className="py-4">
                  <div className="pt-4 pb-2 border-b-2">
                    <p className="text-[#344054] font-semibold text-lg">
                      List Items
                    </p>
                  </div>

                  <div className="w-full bg-gray-100 mt-6">
                    <Table>
                      <TableHeader className="bg-gray-200">
                        <TableRow>
                          <TableHead className="px-4 py-2 text-left">
                            Item
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
                        {expense?.items?.map((item) => (
                          <TableRow key={item.id} className="border-b-2">
                            <TableCell className="px-4 py-3">
                              {item.item}
                            </TableCell>

                            <TableCell className="px-4 py-3 text-right">
                              {currency}
                              {Number(item.price).toLocaleString()}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              x{item.quantity}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              {currency}
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

                {expense.description && (
                  <div className="mt-4">
                    <div className="py-4 border-b-2">
                      <p className="text-[#344054] font-semibold text-lg">
                        Description
                      </p>
                    </div>
                    <div className="flex flex-row gap-2  py-3 rounded-md w-fit mt-2">
                      <p className="text-sm">
                        Procurement of ergonomic office chairs for the new
                        employees in the marketing department. The chairs should
                        support adjustable height, lumbar support, and durable
                        fabric for extended use.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 flex justify-end">
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

export default ExpenseMgtDetailDrawer;
