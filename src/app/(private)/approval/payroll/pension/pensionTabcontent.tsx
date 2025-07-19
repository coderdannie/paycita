// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FiInfo } from "react-icons/fi";
// import LoadingPage from "@/src/app/loading";
// import useApiRequest from "@/src/hooks/useApiRequest";
// import ApiPagination from "@/src/components/common/General/TanTable/apiPagination";
// import TableHeader from "@/src/components/data/Approval/salary/tableHeader";
// import StatusBadge from "@/src/components/data/Approval/salary/statusBadge";
// import ActionModal from "@/src/components/data/Approval/salary/actionModal";
// import StatusChangeModal from "@/src/components/data/Approval/salary/statusChangeModal";
// import FilterSidebar from "@/src/components/data/Approval/pension/filter";

// interface PensionData {
// 	id: string;
// 	name: string;
// 	staffCount: number;
// 	amount: string;
// 	status: "Approved" | "Pending" | "Rejected";
// 	date: string;
// 	actionTime: string;
// }

// interface PensionTabContentProps {
// 	isFilterOpen: boolean;
// 	setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const PensionTabContent: React.FC<PensionTabContentProps> = ({
// 	isFilterOpen,
// 	setIsFilterOpen,
// }) => {
// 	const router = useRouter();
// 	const { getRequest } = useApiRequest();
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [isProcessing, setIsProcessing] = useState(false);
// 	const [selectedItems, setSelectedItems] = useState<string[]>([]);
// 	const [selectAll, setSelectAll] = useState(false);
// 	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
// 	const [currentItemId, setCurrentItemId] = useState<string | null>(null);
// 	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
// 	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

// 	// Sample data
// 	const [pensionData, setPensionData] = useState<PensionData[]>([
// 		{
// 			id: "1",
// 			name: "ARM Pension",
// 			staffCount: 34,
// 			amount: "₦25,000,000",
// 			status: "Approved",
// 			date: "30/04/2025",
// 			actionTime: "10 mins ago",
// 		},
// 		{
// 			id: "2",
// 			name: "Sigma Pension",
// 			staffCount: 34,
// 			amount: "₦25,000,000",
// 			status: "Pending",
// 			date: "30/04/2025",
// 			actionTime: "10 mins ago",
// 		},
// 		{
// 			id: "3",
// 			name: "Sigma Pension",
// 			staffCount: 34,
// 			amount: "₦25,000,000",
// 			status: "Approved",
// 			date: "30/04/2025",
// 			actionTime: "8 hrs ago",
// 		},
// 	]);

// 	// Fetch pension data
// 	useEffect(() => {
// 		const fetchPensionData = async () => {
// 			setIsLoading(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				// In real app, you would call: await getRequest("/user/pension-data", callback);
// 				setIsLoading(false);
// 			} catch (error) {
			
// 				setIsLoading(false);
// 			}
// 		};

// 		fetchPensionData();
// 	}, []);

// 	useEffect(() => {
// 		if (selectAll) {
// 			setSelectedItems(pensionData.map((item) => item.id));
// 		} else {
// 			setSelectedItems([]);
// 		}
// 	}, [selectAll, pensionData]);

// 	const handleSelectItem = (id: string) => {
// 		if (selectedItems.includes(id)) {
// 			setSelectedItems(selectedItems.filter((item) => item !== id));
// 		} else {
// 			setSelectedItems([...selectedItems, id]);
// 		}
// 	};

// 	const handleSelectAll = () => {
// 		setSelectAll(!selectAll);
// 	};

// 	const handleStatusChange = async (
// 		newStatus: "Pending" | "Approved" | "Rejected"
// 	) => {
// 		if (currentItemId) {
// 			setIsProcessing(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				setPensionData(
// 					pensionData.map((item) =>
// 						item.id === currentItemId ? { ...item, status: newStatus } : item
// 					)
// 				);
// 			} catch (error) {
				
// 			} finally {
// 				setIsProcessing(false);
// 				setIsStatusModalOpen(false);
// 				setCurrentItemId(null);
// 			}
// 		}
// 	};

// 	const handleOpenStatusModal = (id: string) => {
// 		setCurrentItemId(id);
// 		setIsStatusModalOpen(true);
// 	};

// 	const handleOpenApproveModal = (id: string) => {
// 		setCurrentItemId(id);
// 		setIsApproveModalOpen(true);
// 	};

// 	const handleOpenRejectModal = (id: string) => {
// 		setCurrentItemId(id);
// 		setIsRejectModalOpen(true);
// 	};

// 	const handleApprove = async () => {
// 		if (currentItemId) {
// 			setIsProcessing(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				setPensionData(
// 					pensionData.map((item) =>
// 						item.id === currentItemId ? { ...item, status: "Approved" } : item
// 					)
// 				);
// 			} catch (error) {
				
// 			} finally {
// 				setIsProcessing(false);
// 				setIsApproveModalOpen(false);
// 				setCurrentItemId(null);
// 			}
// 		}
// 	};

// 	const handleReject = async () => {
// 		if (currentItemId) {
// 			setIsProcessing(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				setPensionData(
// 					pensionData.map((item) =>
// 						item.id === currentItemId ? { ...item, status: "Rejected" } : item
// 					)
// 				);
// 			} catch (error) {
				
// 			} finally {
// 				setIsProcessing(false);
// 				setIsRejectModalOpen(false);
// 				setCurrentItemId(null);
// 			}
// 		}
// 	};

// 	const navigateToPensionDetails = (id: string) => {
// 		router.push(`/dashboard/approval/payroll/pension/${id}`);
// 	};

// 	// Show loading page when fetching initial data
// 	if (isLoading) {
// 		return <LoadingPage text='Loading pension data...' />;
// 	}

// 	return (
// 		<>
// 			<div className='bg-white rounded-lg'>
// 				{/* Table Component */}
// 				<div className='overflow-x-auto'>
// 					<table className='min-w-full divide-y divide-gray-200'>
// 						<thead className='bg-gray-50'>
// 							<tr>
// 								<th className='px-4 py-3 w-8'>
// 									<input
// 										type='checkbox'
// 										className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
// 										checked={selectAll}
// 										onChange={handleSelectAll}
// 									/>
// 								</th>
// 								<TableHeader label='Pension Name' />
// 								<TableHeader label='No of Staffs' />
// 								<TableHeader label='Amount Remitted' />
// 								<TableHeader label='Status' />
// 								<TableHeader label='Date' />
// 								<TableHeader label='Action Time' />
// 								<th className='px-4 py-3 text-xs font-medium text-gray-600 tracking-wider whitespace-nowrap'>
// 									Action
// 								</th>
// 							</tr>
// 						</thead>
// 						<tbody className='bg-white divide-y divide-gray-200'>
// 							{pensionData.map((item) => (
// 								<tr key={item.id} className='hover:bg-gray-50'>
// 									<td className='px-4 py-4'>
// 										<input
// 											type='checkbox'
// 											className='rounded border-gray-300 text-[#692E9F] focus:ring-[#692E9F]'
// 											checked={selectedItems.includes(item.id)}
// 											onChange={() => handleSelectItem(item.id)}
// 										/>
// 									</td>
// 									<td className='px-4 py-4 whitespace-nowrap'>{item.name}</td>
// 									<td className='px-4 py-4 whitespace-nowrap'>
// 										{item.staffCount}
// 									</td>
// 									<td className='px-4 py-4 whitespace-nowrap'>{item.amount}</td>
// 									<td className='px-4 py-4 whitespace-nowrap'>
// 										<StatusBadge status={item.status} />
// 									</td>
// 									<td className='px-4 py-4 whitespace-nowrap'>{item.date}</td>
// 									<td className='px-4 py-4 whitespace-nowrap'>
// 										{item.actionTime}
// 									</td>
// 									<td className='px-4 py-4 whitespace-nowrap text-right'>
// 										<div className='flex justify-end items-center space-x-2'>
// 											{item.status === "Approved" ? (
// 												<button
// 													className='px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 transition-colors'
// 													onClick={() => handleOpenStatusModal(item.id)}
// 												>
// 													Change status
// 												</button>
// 											) : item.status === "Pending" ? (
// 												<div className='flex space-x-2'>
// 													<button
// 														className='px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 transition-colors'
// 														onClick={() => handleOpenApproveModal(item.id)}
// 													>
// 														Approve
// 													</button>
// 													<button
// 														className='px-4 py-2 border border-[#CB0606] text-[#970404] rounded-md hover:bg-red-50 transition-colors'
// 														onClick={() => handleOpenRejectModal(item.id)}
// 													>
// 														Reject
// 													</button>
// 												</div>
// 											) : (
// 												<button
// 													className='px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 transition-colors'
// 													onClick={() => handleOpenStatusModal(item.id)}
// 												>
// 													Change status
// 												</button>
// 											)}
// 											<button
// 												className='p-1 text-gray-500 border rounded hover:text-gray-700'
// 												onClick={() => navigateToPensionDetails(item.id)}
// 											>
// 												<FiInfo className='h-5 w-5' />
// 											</button>
// 										</div>
// 									</td>
// 								</tr>
// 							))}
// 						</tbody>
// 					</table>
// 				</div>

// 				{/* Filter Sidebar */}
// 				{isFilterOpen && (
// 					<FilterSidebar
// 						isOpen={isFilterOpen}
// 						onClose={() => setIsFilterOpen(false)}
// 						onApplyFilter={() => {
// 							// Handle filter application logic
// 							setIsFilterOpen(false);
// 						}}
// 					/>
// 				)}

// 				{/* Modals */}
// 				{isStatusModalOpen && (
// 					<StatusChangeModal
// 						isOpen={isStatusModalOpen}
// 						onClose={() => setIsStatusModalOpen(false)}
// 						onConfirm={handleStatusChange}
// 						loading={isProcessing}
// 					/>
// 				)}

// 				{isApproveModalOpen && (
// 					<ActionModal
// 						isOpen={isApproveModalOpen}
// 						onClose={() => setIsApproveModalOpen(false)}
// 						onConfirm={handleApprove}
// 						actionType='approve'
// 						loading={isProcessing}
// 					/>
// 				)}

// 				{isRejectModalOpen && (
// 					<ActionModal
// 						isOpen={isRejectModalOpen}
// 						onClose={() => setIsRejectModalOpen(false)}
// 						onConfirm={handleReject}
// 						actionType='reject'
// 						loading={isProcessing}
// 					/>
// 				)}
// 			</div>

// 			<div className='flex justify-center p-4'>
// 				<ApiPagination
// 					pagination={{
// 						current_page: 1,
// 						total_pages: 4,
// 						total_records: 24,
// 						per_page: 6,
// 					}}
// 					// setCurrentPage={(page) => }
// 				/>
// 			</div>
// 		</>
// 	);
// };

// export default PensionTabContent;
