// "use client";

// import React, { useState, useEffect } from "react";
// import useApiRequest from "@/src/hooks/useApiRequest";
// import LoadingPage from "@/src/app/loading";
// import ApiPagination from "@/src/components/common/General/TanTable/apiPagination";
// import ActionModal from "@/src/components/data/Approval/salary/actionModal";
// import FilterSidebar, { FilterValues } from "@/src/components/data/Approval/salary/filter";
// import StatusChangeModal from "@/src/components/data/Approval/salary/statusChangeModal";
// import SalaryTable from "@/src/components/data/Approval/salary/salaryTable";
// import OTPApprovalModal from "../../reimbursement-mgt/otp-approval";
// import { PayrollEntry } from "@/src/types/payrollEntry";


// interface SalaryTabContentProps {
// 	isFilterOpen: boolean;
// 	setIsFilterOpen: (isOpen: boolean) => void;
// }

// const SalaryTabContent: React.FC<SalaryTabContentProps> = ({
// 	isFilterOpen,
// 	setIsFilterOpen,
// }) => {
// 	// State for modals
// 	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
// 	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
// 	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

// 	// Selected entry for actions
// 	const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);

// 	// Sample data for the table
// 	const [payrollData, setPayrollData] = useState<PayrollEntry[]>([]);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [isProcessing, setIsProcessing] = useState(false);
// 	const { getRequest, loading } = useApiRequest();

// 	// Fetch salary data
// 	useEffect(() => {
// 		const fetchSalaryData = async () => {
// 			setIsLoading(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				// In real app, you would call: await getRequest("/user/salary-data", callback);
// 				setIsLoading(false);
// 			} catch (error) {
			
// 				setIsLoading(false);
// 			}
// 		};

// 		fetchSalaryData();
// 	}, []);

// 	// Handlers for table actions
// 	const handleApproveClick = (entry: PayrollEntry) => {
// 		setSelectedEntry(entry);
// 		setIsApproveModalOpen(true);
// 	};

// 	const handleRejectClick = (entry: PayrollEntry) => {
// 		setSelectedEntry(entry);
// 		setIsRejectModalOpen(true);
// 	};

// 	const handleChangeStatusClick = (entry: PayrollEntry) => {
// 		setSelectedEntry(entry);
// 		setIsStatusModalOpen(true);
// 	};

// 	// Confirm handlers for modals
// 	const handleApproveConfirm = async () => {
// 		if (selectedEntry) {
// 			setIsProcessing(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				// Update the status of the selected entry
// 				const updatedData = payrollData.map((entry) =>
// 					entry === selectedEntry
// 						? { ...entry, status: "Approved" as const }
// 						: entry
// 				);
// 				setPayrollData(updatedData);
// 			} catch (error) {
			
// 			} finally {
// 				setIsProcessing(false);
// 				setIsApproveModalOpen(false);
// 			}
// 		}
// 	};

// 	const handleRejectConfirm = async (comment?: string) => {
// 		if (selectedEntry) {
// 			setIsProcessing(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				// Update the status of the selected entry
// 				const updatedData = payrollData.map((entry) =>
// 					entry === selectedEntry
// 						? { ...entry, status: "Rejected" as const }
// 						: entry
// 				);
// 				setPayrollData(updatedData);
// 			} catch (error) {
			
// 			} finally {
// 				setIsProcessing(false);
// 				setIsRejectModalOpen(false);
// 			}
// 		}
// 	};

// 	const handleStatusChangeConfirm = async (
// 		newStatus: "Pending" | "Approved" | "Rejected"
// 	) => {
// 		if (selectedEntry) {
// 			setIsProcessing(true);
// 			try {
// 				// Simulate API call
// 				await new Promise((resolve) => setTimeout(resolve, 1000));
// 				// Update the status of the selected entry
// 				const updatedData = payrollData.map((entry) =>
// 					entry === selectedEntry ? { ...entry, status: newStatus } : entry
// 				);
// 				setPayrollData(updatedData);
// 			} catch (error) {
			
// 			} finally {
// 				setIsProcessing(false);
// 				setIsStatusModalOpen(false);
// 			}
// 		}
// 	};

// 	// Filter handler
// 	const handleApplyFilter = (filters: FilterValues) => {};

// 	const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

// 	// Show loading page when fetching initial data
// 	if (isLoading) {
// 		return <LoadingPage text='Loading salary data...' />;
// 	}

// 	return (
// 		<div>
// 			{/* Data Table */}
// 			<SalaryTable
// 				data={payrollData}
// 				onApprove={handleApproveClick}
// 				onReject={handleRejectClick}
// 				onChangeStatus={handleChangeStatusClick}
// 			/>

// 			{/* Pagination */}
// 			<div className='mt-6'>
// 				<ApiPagination
// 					pagination={{
// 						current_page: 1,
// 						total_pages: 4,
// 						total_records: 24,
// 						per_page: 6,
// 					}}
// 					// setCurrentPage={(page) => )}
// 				/>
// 			</div>

// 			{/* Modals */}
// 			<ActionModal
// 				isOpen={isApproveModalOpen}
// 				onClose={() => setIsApproveModalOpen(false)}
// 				onConfirm={handleApproveConfirm}
// 				actionType='approve'
// 				loading={isProcessing}
// 			/>
// 			<ActionModal
// 				isOpen={isRejectModalOpen}
// 				onClose={() => setIsRejectModalOpen(false)}
// 				onConfirm={handleRejectConfirm}
// 				actionType='reject'
// 				loading={isProcessing}
// 			/>
// 			<StatusChangeModal
// 				isOpen={isStatusModalOpen}
// 				onClose={() => setIsStatusModalOpen(false)}
// 				onConfirm={handleStatusChangeConfirm}
// 				loading={isProcessing}
// 			/>
// 			<FilterSidebar
// 				isOpen={isFilterOpen}
// 				onClose={() => setIsFilterOpen(false)}
// 				onApplyFilter={handleApplyFilter}
// 			/>
// 			<OTPApprovalModal
// 				isOpen={isOtpModalOpen}
// 				onClose={() => setIsOtpModalOpen(false)}
// 				approvalStatusId={selectedEntry?.id}
// 				callback={() => {
// 					setIsOtpModalOpen(false);
// 					// fetchPayroll(1, true);
// 				}}
// 				title='Salary Approval'
// 			/>
// 		</div>
// 	);
// };

// export default SalaryTabContent;
