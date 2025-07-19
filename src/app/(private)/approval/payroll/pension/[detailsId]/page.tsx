// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FiSearch, FiChevronRight } from "react-icons/fi";
// import DropdownSelect from "@/src/components/data/Approval/salary/dropdownSelect";
// import LoadingPage from "@/src/app/loading";
// import useApiRequest from "@/src/hooks/useApiRequest";

// interface StaffData {
//   id: string;
//   name: string;
//   amount: string;
// }

// interface PensionDetailPageProps {
//   params: {
//     detailsId: string;
//   };
// }

// // Sample pension data map (in a real application, this would come from an API)
// const pensionProviders = {
//   "1": {
//     name: "ARM Pension",
//     amount: "₦25,000,000",
//     staffCount: 34,
//   },
//   "2": {
//     name: "Sigma Pension",
//     amount: "₦25,000,000",
//     staffCount: 34,
//   },
//   "3": {
//     name: "Sigma Pension",
//     amount: "₦25,000,000",
//     staffCount: 34,
//   },
// };

// const PensionDetailPage: React.FC<PensionDetailPageProps> = ({ params }) => {
//   const router = useRouter();
//   const { detailsId } = params;
//   const { getRequest } = useApiRequest();
//   const [isLoading, setIsLoading] = useState(true);

//   // Get pension provider info from our sample data
//   const pensionInfo = pensionProviders[
//     detailsId as keyof typeof pensionProviders
//   ] || {
//     name: "Unknown Pension",
//     amount: "₦0",
//     staffCount: 0,
//   };

//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPeriod, setCurrentPeriod] = useState("This Month");
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // Sample data
//   const [staffData] = useState<StaffData[]>([
//     { id: "1", name: "Sarah Johnson", amount: "₦52,000" },
//     { id: "2", name: "Michael Williams", amount: "₦56,000" },
//     { id: "3", name: "Emily Davis", amount: "₦5,000" },
//     { id: "4", name: "James Martinez", amount: "₦90,000" },
//     { id: "5", name: "Daniel Miller", amount: "₦88,000" },
//     { id: "6", name: "John Smith", amount: "₦34,000" },
//     { id: "7", name: "Isabella Taylor", amount: "₦64,000" },
//     { id: "8", name: "Sophia Hernandez", amount: "₦58,000" },
//     { id: "9", name: "Matthew Clark", amount: "₦50,000" },
//     { id: "10", name: "Ava Robinson", amount: "₦57,000" },
//     { id: "11", name: "Liam Thompson", amount: "₦23,000" },
//   ]);

//   // Fetch pension details
//   useEffect(() => {
//     const fetchPensionDetails = async () => {
//       setIsLoading(true);
//       try {
//         // Simulate API call
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         // In real app, you would call: await getRequest(`/user/pension-details/${detailsId}`, callback);
//         setIsLoading(false);
//       } catch (error) {
//         setIsLoading(false);
//       }
//     };

//     fetchPensionDetails();
//   }, [detailsId]);

//   // Period options for dropdown
//   const periodOptions = [
//     { value: "This Month", label: "This Month" },
//     { value: "Last Month", label: "Last Month" },
//     { value: "Custom", label: "Custom" },
//   ];

//   const handleSelectItem = (id: string) => {
//     if (selectedItems.includes(id)) {
//       setSelectedItems(selectedItems.filter((item) => item !== id));
//     } else {
//       setSelectedItems([...selectedItems, id]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(staffData.map((item) => item.id));
//     }
//     setSelectAll(!selectAll);
//   };

//   const filteredStaff = staffData.filter((staff) =>
//     staff.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Function to handle breadcrumb navigation
//   const handlePensionNavigation = () => {
//     router.push("/dashboard/approval/payroll");
//   };

//   // Show loading page when fetching initial data
//   if (isLoading) {
//     return <LoadingPage text="Loading pension details..." />;
//   }

//   return (
//     <div className="container mx-auto px-4 py-6 max-w-7xl">
//       {/* Breadcrumb - Updated to use router for navigation */}
//       <div className="flex items-center text-sm text-[#692E9F] mb-6">
//         <button
//           onClick={handlePensionNavigation}
//           className="hover:underline cursor-pointer"
//         >
//           Pension
//         </button>
//         <FiChevronRight className="mx-2" />
//         <span className="text-gray-700">{pensionInfo.name}</span>
//       </div>

//       {/* Title */}
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">
//         {pensionInfo.name}
//       </h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-lg shadow-sm text-center">
//           <div className="text-3xl font-bold text-gray-800 mb-2">
//             {pensionInfo.amount}
//           </div>
//           <div className="text-sm text-gray-600">Total Pension</div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-sm text-center">
//           <div className="text-3xl font-bold text-gray-800 mb-2">
//             {pensionInfo.staffCount}
//           </div>
//           <div className="text-sm text-gray-600">Total Staff</div>
//         </div>
//       </div>

//       {/* Search and Period selection - Adjusted layout */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <div className="relative w-full sm:w-64">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//             placeholder="Search employee name"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <div className="w-full sm:w-48">
//           <DropdownSelect
//             value={currentPeriod}
//             onChange={setCurrentPeriod}
//             options={periodOptions}
//           />
//         </div>
//       </div>

//       {/* Staff Table */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 w-8">
//                   <input
//                     type="checkbox"
//                     className="rounded border-gray-300 text-[#692E9F] focus:ring-[#692E9F]"
//                     checked={selectAll}
//                     onChange={handleSelectAll}
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider whitespace-nowrap">
//                   <div className="flex items-center space-x-1">
//                     <span>Staff Name</span>
//                   </div>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider whitespace-nowrap">
//                   <div className="flex items-center space-x-1">
//                     <span>Amount Paid</span>
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredStaff.map((staff) => (
//                 <tr key={staff.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-4">
//                     <input
//                       type="checkbox"
//                       className="rounded border-gray-300 text-[#692E9F] focus:ring-[#692E9F]"
//                       checked={selectedItems.includes(staff.id)}
//                       onChange={() => handleSelectItem(staff.id)}
//                     />
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">{staff.name}</td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     {staff.amount}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination - Will be imported separately */}
//       <div className="mt-6"></div>
//     </div>
//   );
// };

// export default PensionDetailPage;



import React from 'react'

const page = () => {
  return <div>PensionDetailPage</div>;
}

export default page
