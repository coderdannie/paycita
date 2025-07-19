// import React, { useEffect, useState } from "react";
// import { TableProps } from "./approvalLoan";
// import LoadingPage from "@/src/app/loading";
// import { formatDate } from "@/src/utils/helper";
// import { useDashboard } from "@/src/context/dashboardContext";
// import { useAuthSelector, useDashboardSelector } from "@/src/Redux/selectors";
// import { PendingLoan } from "@/src/types/loan";
// import TanTable from "@/src/components/common/General/TanTable";


// const LoanTable: React.FC<TableProps> = ({ onApprove, onReject }) => {
//   const { pendingLoan } = useDashboardSelector();
//   const { getLoanApproval, isFetchingLoanApproval } = useDashboard();
//   const { user } = useAuthSelector();
//   const [loan, setLoan] = useState<PendingLoan | null>(null);
//   useEffect(() => {
//     getLoanApproval();
//   }, []);

//   const columns = [
//     {
//       header: "Employee Name",
//       accessorKey: "employee_name",
//     },
//     {
//       header: "Amount Requested",
//       accessorKey: "amount",
//       cell: ({ row }: { row: { original: PendingLoan } }) =>
//         `${user?.user?.currency}${row.original.amount}`,
//     },
//     {
//       header: "Payment Period",
//       accessorKey: "payment_period",
//       cell: ({ row }: { row: { original: PendingLoan } }) =>
//         `${row.original.payment_period} ${
//           Number(row.original.payment_period) === 1 ? "month" : "months"
//         }`,
//     },
//     {
//       header: "Purpose of Loan",
//       accessorKey: "purpose_of_loan",
//     },
//     {
//       header: "Date Requested",
//       accessorKey: "date",
//       cell: ({ row }: { row: { original: PendingLoan } }) =>
//         formatDate(row.original.date),
//     },
//     {
//       header: "Status",
//       accessorKey: "status",
//       cell: ({ row }: { row: { original: PendingLoan } }) => {
//         const status = row.original.status;
//         const statusClasses = {
//           Pending: "bg-[#FFF7E4] text-[#FFA80A]",
//           Approved: "bg-[#EDFCED] text-[#008000]",
//           Rejected: "bg-[#FFF0F0] text-[#FF4B4B]",
//         };
//         return (
//           <span
//             className={`px-2 sm:px-3 py-2 inline-flex text-xs lg:text-xs leading-5 font-medium rounded ${
//               statusClasses[status as keyof typeof statusClasses]
//             }`}
//           >
//             {status}
//           </span>
//         );
//       },
//     },
//     {
//       header: "Action",
//       accessorKey: "actions",
//       cell: ({ row }: { row: { original: PendingLoan } }) => {
//         const loan = row.original;
//         const isDisabled =
//           loan.status !== "pending" && loan.status !== "awaiting_otp";

//         return (
//           <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
//             <button
//               onClick={() => {
//                 setLoan(loan);
//                 onApprove(loan.approval_status_id.toString());
//               }}
//               disabled={isDisabled}
//               className={`inline-flex px-2 sm:px-3 py-1.5 bg-[#692E9F] text-white text-xs font-medium rounded hover:bg-purple-800 ${
//                 isDisabled && "opacity-50"
//               }`}
//             >
//               Approve
//             </button>
//             <button
//               onClick={() => {
//                 setLoan(loan);
//                 onReject(loan.approval_status_id.toString());
//               }}
//               disabled={isDisabled}
//               className={`inline-flex px-2 sm:px-3 py-1.5 border border-[#CB0606] text-[#970404] text-xs font-medium rounded hover:bg-red-50 ${
//                 isDisabled && "opacity-50"
//               }}`}
//             >
//               Reject
//             </button>
//           </div>
//         );
//       },
//     },
//   ];

//   // Show loading page when fetching data
//   if (isFetchingLoanApproval && !pendingLoan?.length) {
//     return <LoadingPage text="Loading Loan Requests..." />;
//   }

//   return (
//     <>
//       <TanTable
//         columnData={columns}
//         data={pendingLoan || []}
//         showSearch
//         className="w-full"
//         loadingState={isFetchingLoanApproval}
//       />
//     </>
//   );
// };

// export default LoanTable;
