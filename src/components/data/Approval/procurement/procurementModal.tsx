// "use client";

// import { useEffect, useState } from "react";
// import { FiX, FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";
// import Image from "next/image";
// import { formatDate } from "@/src/utils/helper";
// import LoadingPage from "@/src/app/loading";
// import { useDashboard } from "@/src/context/dashboardContext";
// import { ProcurementDetails } from "@/src/types/procurements";
// import { ProcurementRequestApproval } from "@/src/types/procurement";


// interface ProcurementModalProps {
//   request: ProcurementRequestApproval;
//   onClose: () => void;
//   onAction: (action: "Approve" | "Reject") => void;
//   title?: string;
//   currency: string;
// }

// export function ProcurementModal({
//   request,
//   onClose,
//   onAction,
//   title = "Procurement Request Details",
//   currency,
// }: ProcurementModalProps) {
//   const { fetchProcurementDetails, isProcurementDetailsFetching } =
//     useDashboard();
//   const [procurement, setProcurement] = useState<ProcurementDetails | null>(
//     null
//   );
//   const [isApprovalFlowOpen, setIsApprovalFlowOpen] = useState(true);

//   useEffect(() => {
//     fetchProcurementDetails(request.procurement_id, false).then((res) => {
//       setProcurement(res);
//     });
//   }, [request.procurement_id]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 animate-in slide-in-from-right">
//       <div className="bg-white w-full md:w-1/2 lg:w-1/3 h-full overflow-y-auto shadow-xl rounded-xl p-1 flex flex-col">
//         {isProcurementDetailsFetching ? (
//           <div className="flex items-center justify-center h-full">
//             <LoadingPage
//               fullPage={false}
//               size="medium"
//               text="Loading procurement details..."
//             />
//           </div>
//         ) : (
//           <div>
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-base font-medium text-gray-800">{title}</h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX size={20} />
//               </button>
//             </div>

//             <div className="p-4 flex-grow overflow-y-auto">
//               <div className="bg-purple-50 p-5 mb-4 rounded-lg border border-[#9B73BF] max-w-full mx-auto">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-base font-medium text-gray-800">
//                       {procurement?.procurement_number}
//                     </h3>
//                     <p className="text-xs text-gray-600">
//                       {procurement?.items.length} Products • Order Placed in{" "}
//                       {formatDate(procurement?.created_at)}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-base font-medium text-gray-800">
//                       {currency}
//                       {procurement?.total_cost}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4 p-3 border rounded-lg max-w-full mx-auto">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-sm text-[#667085]">Requested By</p>
//                   <p className="text-sm font-medium">
//                     {request.user.full_name}
//                   </p>
//                 </div>
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-sm text-[#667085]">Department</p>
//                   <p className="text-sm font-medium">
//                     {request.user.department}
//                   </p>
//                 </div>
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-sm text-[#667085]">Vendor</p>
//                   <p className="text-sm font-medium">
//                     {procurement?.vendor || "N/A"}
//                   </p>
//                 </div>
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-sm text-[#667085]">
//                     Expected Delivery Date
//                   </p>
//                   <p className="text-sm font-medium">
//                     {formatDate(procurement?.expected_delivery_date) || "N/A"}
//                   </p>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <p className="text-sm text-[#667085]">Status</p>
//                   <div>
//                     <span
//                       className={`px-3 py-1 text-sm rounded ${
//                         request.status === "approved"
//                           ? "border border-[#00AA4F] text-[#00AA4F]"
//                           : request.status === "rejected"
//                           ? "border border-[#EA3D3D] text-[#EA3D3D]"
//                           : "border border-[#FFD384] text-[#FFA80A]"
//                       }`}
//                     >
//                       {request.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4 p-3 border rounded-lg max-w-full mx-auto">
//                 <h3 className="text-sm font-medium mb-4">List Items</h3>
//                 <div className="space-y-4">
//                   {procurement?.items.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex justify-between items-center p-3 bg-gray-50 rounded"
//                     >
//                       <p className="text-sm font-medium">{item.item}</p>
//                       <p className="text-sm text-gray-700">
//                         {currency}
//                         {item.price}
//                       </p>
//                       <p className="text-sm text-gray-700">
//                         {item.quantity} Qty
//                       </p>
//                       <p className="text-sm font-medium">
//                         {currency}
//                         {(Number(item.price) * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-4 p-3 border rounded-lg max-w-full mx-auto">
//                 <div
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => setIsApprovalFlowOpen(!isApprovalFlowOpen)}
//                 >
//                   <h3 className="text-sm font-medium">Approval Flow</h3>
//                   {isApprovalFlowOpen ? (
//                     <FiChevronUp size={16} />
//                   ) : (
//                     <FiChevronDown size={16} />
//                   )}
//                 </div>

//                 {isApprovalFlowOpen && procurement?.approvals && (
//                   <div className="mt-3 relative">
//                     <div className="absolute left-6 top-0 rounded bottom-0 w-[.5rem] bg-[#00AA4F]"></div>

//                     <div className="space-y-6">
//                       {Object.entries(procurement.approvals).map(
//                         ([role, approval], index) => (
//                           <div key={index} className="relative">
//                             <div
//                               className={`absolute left-[.9rem] top-6 w-6 h-6 rounded-full flex items-center justify-center ${
//                                 approval.status === "approved"
//                                   ? "bg-[#00AA4F]"
//                                   : approval.status === "rejected"
//                                   ? "bg-[#EA3D3D]"
//                                   : "bg-gray-300"
//                               }`}
//                             >
//                               {approval.status === "approved" && (
//                                 <FiCheck size={12} color="white" />
//                               )}
//                               {approval.status === "rejected" && (
//                                 <FiX size={12} color="white" />
//                               )}
//                             </div>

//                             <div className="ml-12 border rounded-lg p-3">
//                               <div className="flex justify-between items-center">
//                                 <div className="flex items-center gap-2">
//                                   <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
//                                     <Image
//                                       src="/api/placeholder/32/32"
//                                       width={30}
//                                       height={30}
//                                       alt="User"
//                                     />
//                                   </div>
//                                   <p className="text-sm font-medium capitalize">
//                                     {role.split("_").join(" ")}
//                                   </p>
//                                 </div>

//                                 <div className="text-right">
//                                   <p
//                                     className={`text-sm font-medium ${
//                                       approval.status === "approved"
//                                         ? "text-[#00AA4F]"
//                                         : approval.status === "rejected"
//                                         ? "text-[#CB0606]"
//                                         : "text-[#FFA80A]"
//                                     }`}
//                                   >
//                                     {approval.status}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {approval.date}
//                                   </p>
//                                 </div>
//                               </div>

//                               {approval.rejection_reason && (
//                                 <div className="mt-3 border rounded-lg p-3 bg-gray-50">
//                                   <p className="text-sm text-gray-700 mb-1">
//                                     Comment
//                                   </p>
//                                   <p className="text-sm bg-gray-50 rounded">
//                                     {approval.rejection_reason}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="p-3 flex justify-end gap-2 mt-auto">
//               <button
//                 className="px-4 py-1.5 border border-[#EA3D3D] text-[#EA3D3D] rounded text-sm hover:bg-red-50"
//                 onClick={() => onAction("Reject")}
//               >
//                 Reject
//               </button>
//               <button
//                 className="px-4 py-1.5 bg-[#692E9F] text-white rounded text-sm hover:bg-purple-800"
//                 onClick={() => onAction("Approve")}
//               >
//                 Approve
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
