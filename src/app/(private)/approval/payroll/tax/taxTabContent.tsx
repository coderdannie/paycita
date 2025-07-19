// "use client";

// import React, { useEffect, useState } from "react";
// import useApiRequest from "@/src/hooks/useApiRequest";
// import LoadingPage from "@/src/app/loading";
// import ApiPagination from "@/src/components/common/General/TanTable/apiPagination";
// import FilterSidebar from "@/src/components/data/Approval/tax/filter";
// import StatusChangeModal from "@/src/components/data/Approval/salary/statusChangeModal";
// import ActionModal from "@/src/components/data/Approval/salary/actionModal";
// import ActionButton from "@/src/components/data/Approval/salary/actionButton";
// import StatusBadge from "@/src/components/data/Approval/salary/statusBadge";
// import TableHeader from "@/src/components/data/Approval/salary/tableHeader";



// interface TaxEntry {
// 	id: string;
// 	period: string;
// 	totalAmount: string;
// 	status: "Approved" | "Pending" | "Rejected";
// 	date: string;
// 	actionTime: string;
// }

// interface TaxTabContentProps {
// 	isFilterOpen?: boolean;
// 	setIsFilterOpen?: (isOpen: boolean) => void;
// }

// const TaxTabContent: React.FC<TaxTabContentProps> = ({
// 	isFilterOpen = false,
// 	setIsFilterOpen = () => {},
// }) => {
// 	const { getRequest, loading } = useApiRequest();
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [isProcessing, setIsProcessing] = useState(false);

// 	const getAllTax = async () => {
// 		setIsLoading(true);
// 		try {
// 			await getRequest("/user/pending-approval-tax-requests", (data) => {});
// 		} catch (error) {
			
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		getAllTax();
// 	}, []);

// 	const [taxEntries, setTaxEntries] = useState<TaxEntry[]>([
// 		{
// 			id: "1",
// 			period: "January 2025",
// 			totalAmount: "₦19,000,000",
// 			status: "Approved",
// 			date: "30/04/2025",
// 			actionTime: "10 min ago",
// 		},
// 		{
// 			id: "2",
// 			period: "February 2025",
// 			totalAmount: "₦25,000,000",
// 			status: "Pending",
// 			date: "30/04/2025",
// 			actionTime: "2 hrs ago",
// 		},
// 		{
// 			id: "3",
// 			period: "March 2025",
// 			totalAmount: "₦15,000,000",
// 			status: "Approved",
// 			date: "30/04/2025",
// 			actionTime: "8 hrs ago",
// 		},
// 	]);

// 	// State for handling modal visibility
// 	const [selectedEntry, setSelectedEntry] = useState<TaxEntry | null>(null);
// 	const [isActionModalOpen, setIsActionModalOpen] = useState(false);
// 	const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
// 	const [actionType, setActionType] = useState<"approve" | "reject">("approve");

// 	// State for handling checkbox selection
// 	const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

// 	const handleOpenActionModal = (
// 		entry: TaxEntry,
// 		type: "approve" | "reject"
// 	) => {
// 		setSelectedEntry(entry);
// 		setActionType(type);
// 		setIsActionModalOpen(true);
// 	};

// 	const handleOpenStatusChangeModal = (entry: TaxEntry) => {
// 		setSelectedEntry(entry);
// 		setIsStatusChangeModalOpen(true);
// 	};

// 	const handleActionConfirm = async (comment?: string) => {
// 		if (selectedEntry) {
// 			setIsProcessing(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				const newStatus: TaxEntry["status"] =
// 					actionType === "approve" ? "Approved" : "Rejected";
// 				const updatedEntries = taxEntries.map((entry) =>
// 					entry.id === selectedEntry.id
// 						? { ...entry, status: newStatus }
// 						: entry
// 				);
// 				setTaxEntries(updatedEntries);
// 			} catch (error) {
			
// 			} finally {
// 				setIsProcessing(false);
// 				setIsActionModalOpen(false);
// 				setSelectedEntry(null);
// 			}
// 		}
// 	};

// 	const handleStatusChange = async (
// 		newStatus: "Pending" | "Approved" | "Rejected"
// 	) => {
// 		if (selectedEntry) {
// 			setIsProcessing(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				const updatedEntries = taxEntries.map((entry) =>
// 					entry.id === selectedEntry.id
// 						? { ...entry, status: newStatus }
// 						: entry
// 				);
// 				setTaxEntries(updatedEntries);
// 			} catch (error) {
		
// 			} finally {
// 				setIsProcessing(false);
// 				setIsStatusChangeModalOpen(false);
// 				setSelectedEntry(null);
// 			}
// 		}
// 	};

// 	// Handle select all checkbox
// 	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		if (e.target.checked) {
// 			setSelectedEntries(taxEntries.map((entry) => entry.id));
// 		} else {
// 			setSelectedEntries([]);
// 		}
// 	};

// 	// Handle individual checkbox selection
// 	const handleSelectEntry = (id: string) => {
// 		if (selectedEntries.includes(id)) {
// 			setSelectedEntries(selectedEntries.filter((entryId) => entryId !== id));
// 		} else {
// 			setSelectedEntries([...selectedEntries, id]);
// 		}
// 	};

// 	const handleApplyFilter = (filters: any) => {
// 		setIsFilterOpen(false);
// 	};

// 	// Show loading page when fetching initial data
// 	if (isLoading) {
// 		return <LoadingPage text='Loading tax data...' />;
// 	}

// 	return (
// 		<div className='flex flex-col'>
// 			{/* Table container */}
// 			<div className='overflow-x-auto bg-white rounded-lg shadow'>
// 				<table className='min-w-full divide-y divide-gray-200'>
// 					<thead className='bg-gray-50'>
// 						<tr>
// 							<th className='px-4 py-3 w-10'>
// 								<input
// 									type='checkbox'
// 									className='h-4 w-4 text-[#692E9F] focus:ring-[#692E9F] border-gray-300 rounded'
// 									onChange={handleSelectAll}
// 									checked={
// 										selectedEntries.length === taxEntries.length &&
// 										taxEntries.length > 0
// 									}
// 								/>
// 							</th>
// 							<TableHeader label='Period' />
// 							<TableHeader label='Total Amount' />
// 							<TableHeader label='Status' />
// 							<TableHeader label='Date' />
// 							<TableHeader label='Action Time' />
// 							<th className='px-4 py-3 text-right text-xs font-medium text-gray-600 tracking-wider'>
// 								Action
// 							</th>
// 						</tr>
// 					</thead>
// 					<tbody className='bg-white divide-y divide-gray-200'>
// 						{taxEntries.map((entry) => (
// 							<tr key={entry.id} className='hover:bg-gray-50'>
// 								<td className='px-4 py-4 whitespace-nowrap'>
// 									<input
// 										type='checkbox'
// 										className='h-4 w-4 text-[#692E9F] focus:ring-[#692E9F] border-gray-300 rounded'
// 										checked={selectedEntries.includes(entry.id)}
// 										onChange={() => handleSelectEntry(entry.id)}
// 									/>
// 								</td>
// 								<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
// 									{entry.period}
// 								</td>
// 								<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
// 									{entry.totalAmount}
// 								</td>
// 								<td className='px-4 py-4 whitespace-nowrap'>
// 									<StatusBadge status={entry.status} />
// 								</td>
// 								<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
// 									{entry.date}
// 								</td>
// 								<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
// 									{entry.actionTime}
// 								</td>
// 								<td className='px-4 py-4 whitespace-nowrap text-right text-sm font-medium'>
// 									{entry.status === "Pending" ? (
// 										<div className='flex space-x-2 justify-end'>
// 											<ActionButton
// 												label='Approve'
// 												variant='primary'
// 												onClick={() => handleOpenActionModal(entry, "approve")}
// 											/>
// 											<ActionButton
// 												label='Reject'
// 												variant='reject'
// 												onClick={() => handleOpenActionModal(entry, "reject")}
// 											/>
// 										</div>
// 									) : (
// 										<ActionButton
// 											label='Change status'
// 											variant='secondary'
// 											onClick={() => handleOpenStatusChangeModal(entry)}
// 										/>
// 									)}
// 								</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</div>

// 			<div className='mt-4 flex justify-center'>
// 				<ApiPagination
// 					pagination={{
// 						current_page: 1,
// 						total_pages: 4,
// 						total_records: 24,
// 						per_page: 6,
// 					}}
// 					// setCurrentPage={(page) =>}
// 				/>
// 			</div>

// 			<ActionModal
// 				isOpen={isActionModalOpen}
// 				onClose={() => setIsActionModalOpen(false)}
// 				onConfirm={handleActionConfirm}
// 				actionType={actionType}
// 				loading={isProcessing}
// 			/>

// 			<StatusChangeModal
// 				isOpen={isStatusChangeModalOpen}
// 				onClose={() => setIsStatusChangeModalOpen(false)}
// 				onConfirm={handleStatusChange}
// 				loading={isProcessing}
// 			/>

// 			<FilterSidebar
// 				isOpen={isFilterOpen}
// 				onClose={() => setIsFilterOpen(false)}
// 				onApplyFilter={handleApplyFilter}
// 			/>
// 		</div>
// 	);
// };

// export default TaxTabContent;
