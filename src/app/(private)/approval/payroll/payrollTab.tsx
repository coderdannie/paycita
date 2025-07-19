// "use client";
// import React, { useEffect, useState } from "react";
// import { Button } from "@material-tailwind/react";
// import useApiRequest from "@/src/hooks/useApiRequest";
// import { useAuthSelector, useDashboardSelector } from "@/src/Redux/selectors";
// import { useDashboard } from "@/src/context/dashboardContext";
// import { formatDate } from "@/src/utils/helper";
// import TanTable from "@/src/components/common/General/TanTable";
// import ActionModal from "@/src/components/data/Approval/salary/actionModal";
// import OTPApprovalModal from "../reimbursement-mgt/otp-approval";
// import DropdownSelect from "@/src/components/data/Approval/salary/dropdownSelect";

// // Bulk Action Modal Component
// interface BulkActionModalProps {
// 	isOpen: boolean;
// 	onClose: () => void;
// 	onConfirm: (action: "approve" | "reject", reason?: string) => void;
// 	actionType: "approve" | "reject";
// 	selectedCount: number;
// 	loading?: boolean;
// }

// const BulkActionModal: React.FC<BulkActionModalProps> = ({
// 	isOpen,
// 	onClose,
// 	onConfirm,
// 	actionType,
// 	selectedCount,
// 	loading = false,
// }) => {
// 	const [reason, setReason] = useState("");

// 	if (!isOpen) return null;

// 	const handleConfirm = () => {
// 		onConfirm(actionType, reason);
// 		setReason(""); // Reset reason after confirmation
// 	};

// 	return (
// 		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
// 			<div className='bg-white rounded-lg p-6 w-full max-w-md'>
// 				<h2 className='text-xl font-semibold mb-4'>
// 					{actionType === "approve"
// 						? "Approve All Selected"
// 						: "Reject All Selected"}
// 				</h2>

// 				<p className='mb-4'>
// 					{actionType === "approve"
// 						? `Are you sure you want to approve ${selectedCount} selected items?`
// 						: `Are you sure you want to reject ${selectedCount} selected items?`}
// 				</p>

// 				{actionType === "reject" && (
// 					<div className='mb-4'>
// 						<label className='block text-sm text-gray-600 mb-2'>
// 							Rejection Reason (optional)
// 						</label>
// 						<textarea
// 							className='w-full p-2 border border-gray-300 rounded'
// 							rows={4}
// 							placeholder='Enter rejection reason...'
// 							value={reason}
// 							onChange={(e) => setReason(e.target.value)}
// 						/>
// 					</div>
// 				)}

// 				<div className='flex justify-end space-x-3'>
// 					<button
// 						className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
// 						onClick={onClose}
// 						disabled={loading}
// 					>
// 						Cancel
// 					</button>
// 					<button
// 						className={`px-4 py-2 rounded ${
// 							actionType === "approve"
// 								? "bg-[#692E9F] text-white hover:bg-purple-800"
// 								: "bg-[#CB0606] text-white hover:bg-red-700"
// 						} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
// 						onClick={handleConfirm}
// 						disabled={loading}
// 					>
// 						{loading
// 							? "Processing..."
// 							: actionType === "approve"
// 							? "Approve All"
// 							: "Reject All"}
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// interface PayrollTabsProps {
// 	activeTab?: string;
// 	isFilterOpen?: boolean;
// 	setIsFilterOpen?: React.Dispatch<React.SetStateAction<boolean>>;
// 	onTabChange?: (tab: string) => void;
// }

// export default function PayrollTabs({
// 	activeTab: externalActiveTab,
// 	onTabChange,
// }: PayrollTabsProps) {
// 	const [internalActiveTab, setInternalActiveTab] = useState("salary");
// 	const [currentPeriod, setCurrentPeriod] = useState("This Month");
// 	const { pendingPayroll } = useDashboardSelector();
// 	const { user } = useAuthSelector();
// 	const {
// 		handleUpdatePayrollApproval,
// 		isUpdatingPayrollApproval,
// 		getPendingPayroll,
// 		isFetchingPendingPayroll,
// 	} = useDashboard();
// 	const { postRequest, loading } = useApiRequest();
// 	const [isActionModalOpen, setIsActionModalOpen] = useState(false);
// 	const [currentId, setCurrentId] = useState<string | null>(null);
// 	const [currentAction, setCurrentAction] = useState<"approve" | "reject">(
// 		"approve"
// 	);
// 	const [currentMonth, setCurrentMonth] = useState<string>("");
// 	const [currentYear, setCurrentYear] = useState<string>("");
// 	const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
// 	const [isBulkOTPModalOpen, setIsBulkOTPModalOpen] = useState(false);

// 	// Add state for selected items
// 	const [selectedItems, setSelectedItems] = useState<string[]>([]);

// 	// Add state for bulk action modal
// 	const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false);
// 	const [bulkActionType, setBulkActionType] = useState<"approve" | "reject">(
// 		"approve"
// 	);

// 	useEffect(() => {
// 		// Data is already fetched by the parent component
// 		// No need to fetch here as parent handles all data fetching
// 	}, []);

// 	// Log selected items whenever they change
// 	useEffect(() => {
// 		console.log("Selected items:", selectedItems);
// 	}, [selectedItems]);

// 	const activeTab =
// 		externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

// 	const handleTabChange = (tab: string) => {
// 		if (externalActiveTab === undefined) {
// 			setInternalActiveTab(tab);
// 		}
// 		if (onTabChange) {
// 			onTabChange(tab);
// 		}
// 		// Clear selected items when tab changes
// 		setSelectedItems([]);
// 	};

// 	// Handle select all functionality
// 	const handleSelectAll = (checked: boolean) => {
// 		const currentData = getData();
// 		if (checked) {
// 			const allIds = currentData.map((item: any) => item.id.toString());
// 			setSelectedItems(allIds);
// 		} else {
// 			setSelectedItems([]);
// 		}
// 	};

// 	// Handle individual row selection
// 	const handleRowSelect = (id: string, checked: boolean) => {
// 		if (checked) {
// 			setSelectedItems((prev) => [...prev, id]);
// 		} else {
// 			setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
// 		}
// 	};

// 	// Check if all items are selected
// 	const isAllSelected = () => {
// 		const currentData = getData();
// 		return (
// 			selectedItems.length === currentData.length && currentData.length > 0
// 		);
// 	};

// 	// Check if item is selected
// 	const isItemSelected = (id: string) => {
// 		return selectedItems.includes(id);
// 	};

// 	const handlePensionUpdate = async (
// 		status: "approved" | "rejected",
// 		month: string,
// 		year: string,
// 		callback: () => void
// 	) => {
// 		await postRequest(
// 			"/user/update-pension-requests",
// 			{
// 				status,
// 				month,
// 				year,
// 			},
// 			(data) => {
// 				if (data.success) {
// 					getPendingPayroll(true);
// 					callback();
// 				}
// 			}
// 		);
// 	};

// 	const handleTaxUpdate = async (
// 		status: "approved" | "rejected",
// 		month: string,
// 		year: string,
// 		callback: () => void
// 	) => {
// 		await postRequest(
// 			"/user/update-tax-requests",
// 			{
// 				status,
// 				month,
// 				year,
// 			},
// 			(data) => {
// 				if (data.success) {
// 					getPendingPayroll(true);
// 					callback();
// 				}
// 			}
// 		);
// 	};

// 	const handleActionClick = (
// 		id: string,
// 		action: "approve" | "reject",
// 		month?: string,
// 		year?: string
// 	) => {
// 		setCurrentId(id);
// 		setCurrentAction(action);
// 		setCurrentMonth(month || "");
// 		setCurrentYear(year || "");
// 		setIsActionModalOpen(true);
// 	};

// 	// Handle opening bulk action modal
// 	const handleOpenBulkActionModal = (action: "approve" | "reject") => {
// 		setBulkActionType(action);
// 		setIsBulkActionModalOpen(true);
// 	};

// 	// Handle bulk action confirmation
// 	const handleBulkActionConfirm = async (
// 		action: "approve" | "reject",
// 		reason?: string
// 	) => {
// 		await postRequest(
// 			"/user/update-bulk-payroll-requests",
// 			{
// 				payroll_id: selectedItems,
// 				status: action === "approve" ? "approved" : "rejected",
// 				reason,
// 			},
// 			(res) => {
// 				if (res.success) {
// 					if (res.data.requires_otp) {
// 						setIsBulkOTPModalOpen(true);
// 					} else {
// 						getPendingPayroll(true);
// 						setSelectedItems([]);
// 					}
// 				}
// 			}
// 		);
// 		setIsBulkActionModalOpen(false);
// 	};

// 	const handleActionConfirm = async (comment?: string) => {
// 		if (activeTab === "salary" && !currentId) return;

// 		if (activeTab === "tax" || activeTab === "pension") {
// 			const status = currentAction === "approve" ? "approved" : "rejected";
// 			if (activeTab === "tax") {
// 				await handleTaxUpdate(status, currentMonth, currentYear, () => {
// 					setIsActionModalOpen(false);
// 				});
// 			} else {
// 				await handlePensionUpdate(status, currentMonth, currentYear, () => {
// 					setIsActionModalOpen(false);
// 				});
// 			}
// 		} else {
// 			await handleUpdatePayrollApproval(
// 				parseInt(currentId),
// 				{
// 					status: currentAction === "approve" ? "approved" : "rejected",
// 					reason: comment || undefined,
// 				},
// 				(data) => {
// 					if (data.requires_otp) {
// 						setIsOTPModalOpen(true);
// 					} else {
// 						setIsActionModalOpen(false);
// 					}
// 				}
// 			);
// 		}
// 	};

// 	const periodOptions = [
// 		{ value: "This Month", label: "This Month" },
// 		{ value: "Last Month", label: "Last Month" },
// 		{ value: "Custom", label: "Custom" },
// 	];

// 	const tabs = [
// 		{ id: "salary", label: "Salary" },
// 		{ id: "tax", label: "Tax" },
// 		{ id: "pension", label: "Pension" },
// 	];

// 	const getColumns = () => {
// 		switch (activeTab) {
// 			case "salary":
// 				return [
// 					{
// 						header: (
// 							<div className='flex items-center gap-2'>
// 								<input
// 									type='checkbox'
// 									className='w-4 h-4'
// 									checked={isAllSelected()}
// 									onChange={(e) => handleSelectAll(e.target.checked)}
// 								/>
// 							</div>
// 						),
// 						accessorKey: "select",
// 						cell: ({ row }) => (
// 							<input
// 								type='checkbox'
// 								className='w-4 h-4'
// 								checked={isItemSelected(row.original.id.toString())}
// 								onChange={(e) =>
// 									handleRowSelect(row.original.id.toString(), e.target.checked)
// 								}
// 							/>
// 						),
// 					},
// 					{
// 						header: "Staff Name",
// 						accessorKey: "staff_name",
// 					},
// 					{
// 						header: "Gross Income",
// 						accessorKey: "gross_income",
// 						cell: ({ row }) =>
// 							`${user?.user?.currency}${row.original.gross_income}`,
// 					},
// 					{
// 						header: "Deductions",
// 						accessorKey: "deductions",
// 						cell: ({ row }) =>
// 							`${user?.user?.currency}${row.original.deductions}`,
// 					},
// 					{
// 						header: "Net Pay",
// 						accessorKey: "net_pay",
// 						cell: ({ row }) => `${user?.user?.currency}${row.original.net_pay}`,
// 					},
// 					{
// 						header: "Date",
// 						accessorKey: "date",
// 						cell: ({ row }) => formatDate(row.original.date),
// 					},
// 					{
// 						header: "Status",
// 						accessorKey: "status",
// 						cell: ({ row }) => {
// 							const status = row.original.status;
// 							const statusClasses = {
// 								pending: "bg-[#FFF7E4] text-[#FFA80A]",
// 								approved: "bg-[#EDFCED] text-[#008000]",
// 								rejected: "bg-[#FFF0F0] text-[#FF4B4B]",
// 							};
// 							return (
// 								<span
// 									className={`px-2 sm:px-3 py-2 inline-flex text-xs lg:text-xs capitalize leading-5 font-medium rounded ${
// 										statusClasses[
// 											status.toLowerCase() as keyof typeof statusClasses
// 										]
// 									}`}
// 								>
// 									{status}
// 								</span>
// 							);
// 						},
// 					},
// 					{
// 						header: "Action",
// 						accessorKey: "actions",
// 						cell: ({ row }) => {
// 							const isDisabled =
// 								row.original.status.toLowerCase() !== "pending" &&
// 								row.original.status.toLowerCase() !== "awaiting_otp";
// 							return (
// 								<div className='flex flex-col sm:flex-row gap-1 sm:gap-2'>
// 									<button
// 										onClick={() =>
// 											handleActionClick(row.original.id.toString(), "approve")
// 										}
// 										disabled={isDisabled}
// 										className={`inline-flex px-2 sm:px-3 py-1.5 bg-[#692E9F] text-white text-xs font-medium rounded hover:bg-purple-800 ${
// 											isDisabled && "opacity-50"
// 										}`}
// 									>
// 										Approve
// 									</button>
// 									<button
// 										onClick={() =>
// 											handleActionClick(row.original.id.toString(), "reject")
// 										}
// 										disabled={isDisabled}
// 										className={`inline-flex px-2 sm:px-3 py-1.5 border border-[#CB0606] text-[#970404] text-xs font-medium rounded hover:bg-red-50 ${
// 											isDisabled && "opacity-50"
// 										}`}
// 									>
// 										Reject
// 									</button>
// 								</div>
// 							);
// 						},
// 					},
// 				];
// 			case "tax":
// 				return [
// 					{
// 						header: (
// 							<div className='flex items-center gap-2'>
// 								<input
// 									type='checkbox'
// 									className='w-4 h-4'
// 									checked={isAllSelected()}
// 									onChange={(e) => handleSelectAll(e.target.checked)}
// 								/>
// 							</div>
// 						),
// 						accessorKey: "select",
// 						cell: ({ row }) => (
// 							<input
// 								type='checkbox'
// 								className='w-4 h-4'
// 								checked={isItemSelected(row.original?.id?.toString())}
// 								onChange={(e) =>
// 									handleRowSelect(
// 										row.original?.id?.toString(),
// 										e.target.checked
// 									)
// 								}
// 							/>
// 						),
// 					},
// 					{
// 						header: "Month",
// 						accessorKey: "month_year",
// 						cell: ({ row }) => {
// 							const month = row.original.month_year.split(" ")[0];
// 							return `${month}`;
// 						},
// 					},
// 					{
// 						header: "Year",
// 						accessorKey: "month_year",
// 						cell: ({ row }) => {
// 							const year = row.original.month_year.split(" ")[1];
// 							return `${year}`;
// 						},
// 					},
// 					{
// 						header: "Total Amount",
// 						accessorKey: "total_amount",
// 						cell: ({ row }) =>
// 							`${user?.user?.currency}${row.original.total_amount}`,
// 					},
// 					{
// 						header: "Status",
// 						accessorKey: "status",
// 						cell: ({ row }) => {
// 							const status = row.original.status;
// 							const statusClasses = {
// 								pending: "bg-[#FFF7E4] text-[#FFA80A]",
// 								approved: "bg-[#EDFCED] text-[#008000]",
// 								rejected: "bg-[#FFF0F0] text-[#FF4B4B]",
// 							};
// 							return (
// 								<span
// 									className={`px-2 sm:px-3 py-2 inline-flex text-xs lg:text-xs leading-5 font-medium rounded ${
// 										statusClasses[
// 											status.toLowerCase() as keyof typeof statusClasses
// 										]
// 									}`}
// 								>
// 									{status}
// 								</span>
// 							);
// 						},
// 					},
// 					{
// 						header: "Action",
// 						accessorKey: "actions",
// 						cell: ({ row }) => {
// 							const isDisabled =
// 								row.original.status.toLowerCase() !== "pending";
// 							const [month, year] = row.original.month_year.split(" ");
// 							return (
// 								<div className='flex flex-col sm:flex-row gap-1 sm:gap-2'>
// 									<button
// 										onClick={() =>
// 											handleActionClick(
// 												row.original?.id?.toString() || "",
// 												"approve",
// 												month,
// 												year
// 											)
// 										}
// 										disabled={isDisabled}
// 										className={`inline-flex px-2 sm:px-3 py-1.5 bg-[#692E9F] text-white text-xs font-medium rounded hover:bg-purple-800 ${
// 											isDisabled && "opacity-50"
// 										}`}
// 									>
// 										Approve
// 									</button>
// 									<button
// 										onClick={() =>
// 											handleActionClick(
// 												row?.original?.id?.toString() || "",
// 												"reject",
// 												month,
// 												year
// 											)
// 										}
// 										disabled={isDisabled}
// 										className={`inline-flex px-2 sm:px-3 py-1.5 border border-[#CB0606] text-[#970404] text-xs font-medium rounded hover:bg-red-50 ${
// 											isDisabled && "opacity-50"
// 										}`}
// 									>
// 										Reject
// 									</button>
// 								</div>
// 							);
// 						},
// 					},
// 				];
// 			case "pension":
// 				return [
// 					{
// 						header: (
// 							<div className='flex items-center gap-2'>
// 								<input
// 									type='checkbox'
// 									className='w-4 h-4'
// 									checked={isAllSelected()}
// 									onChange={(e) => handleSelectAll(e.target.checked)}
// 								/>
// 							</div>
// 						),
// 						accessorKey: "select",
// 						cell: ({ row }) => (
// 							<input
// 								type='checkbox'
// 								className='w-4 h-4'
// 								checked={isItemSelected(row.original?.id?.toString())}
// 								onChange={(e) =>
// 									handleRowSelect(
// 										row.original?.id?.toString(),
// 										e.target.checked
// 									)
// 								}
// 							/>
// 						),
// 					},
// 					{
// 						header: "Month",
// 						accessorKey: "month_year",
// 						cell: ({ row }) => {
// 							const month = row.original.month_year.split(" ")[0];
// 							return `${month}`;
// 						},
// 					},
// 					{
// 						header: "Year",
// 						accessorKey: "month_year",
// 						cell: ({ row }) => {
// 							const year = row.original.month_year.split(" ")[1];
// 							return `${year}`;
// 						},
// 					},
// 					{
// 						header: "Total Amount",
// 						accessorKey: "total_amount",
// 						cell: ({ row }) =>
// 							`${user?.user?.currency}${row.original.total_amount}`,
// 					},
// 					{
// 						header: "Status",
// 						accessorKey: "status",
// 						cell: ({ row }) => {
// 							const status = row.original.status;
// 							const statusClasses = {
// 								pending: "bg-[#FFF7E4] text-[#FFA80A]",
// 								approved: "bg-[#EDFCED] text-[#008000]",
// 								rejected: "bg-[#FFF0F0] text-[#FF4B4B]",
// 							};
// 							return (
// 								<span
// 									className={`px-2 sm:px-3 py-2 inline-flex text-xs lg:text-xs leading-5 font-medium rounded ${
// 										statusClasses[
// 											status.toLowerCase() as keyof typeof statusClasses
// 										]
// 									}`}
// 								>
// 									{status}
// 								</span>
// 							);
// 						},
// 					},
// 					{
// 						header: "Action",
// 						accessorKey: "actions",
// 						cell: ({ row }) => {
// 							const isDisabled =
// 								row.original.status.toLowerCase() !== "pending";
// 							const [month, year] = row.original.month_year.split(" ");
// 							return (
// 								<div className='flex flex-col sm:flex-row gap-1 sm:gap-2'>
// 									<button
// 										onClick={() =>
// 											handleActionClick(
// 												row?.original?.id?.toString() || "",
// 												"approve",
// 												month,
// 												year
// 											)
// 										}
// 										disabled={isDisabled}
// 										className={`inline-flex px-2 sm:px-3 py-1.5 bg-[#692E9F] text-white text-xs font-medium rounded hover:bg-purple-800 ${
// 											isDisabled && "opacity-50"
// 										}`}
// 									>
// 										Approve
// 									</button>
// 									<button
// 										onClick={() =>
// 											handleActionClick(
// 												row?.original?.id?.toString() || "",
// 												"reject",
// 												month,
// 												year
// 											)
// 										}
// 										disabled={isDisabled}
// 										className={`inline-flex px-2 sm:px-3 py-1.5 border border-[#CB0606] text-[#970404] text-xs font-medium rounded hover:bg-red-50 ${
// 											isDisabled && "opacity-50"
// 										}`}
// 									>
// 										Reject
// 									</button>
// 								</div>
// 							);
// 						},
// 					},
// 				];
// 			default:
// 				return [];
// 		}
// 	};

// 	const getData = () => {
// 		if (!pendingPayroll) return [];
// 		switch (activeTab) {
// 			case "salary":
// 				return pendingPayroll.salary || [];
// 			case "tax":
// 				return pendingPayroll.tax || [];
// 			case "pension":
// 				return pendingPayroll.pension || [];
// 			default:
// 				return [];
// 		}
// 	};

// 	return (
// 		<div>
// 			<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
// 				<div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
// 					<div className='w-full md:w-48'>
// 						<DropdownSelect
// 							value={currentPeriod}
// 							onChange={setCurrentPeriod}
// 							options={periodOptions}
// 						/>
// 					</div>
// 				</div>

// 				{activeTab === "salary" && selectedItems.length > 0 && (
// 					<div className='flex flex-col md:flex-row gap-2 w-full lg:items-end lg:justify-end'>
// 						<Button
// 							className='bg-pry p-3 px-6 capitalize font-normal text-base'
// 							onClick={() => handleOpenBulkActionModal("approve")}
// 						>
// 							Approve all ({selectedItems.length})
// 						</Button>
// 						<Button
// 							className='bg-transparent border-2 text-red_pry border-red_pry p-3 px-6 capitalize font-normal text-base'
// 							onClick={() => handleOpenBulkActionModal("reject")}
// 						>
// 							Reject all ({selectedItems.length})
// 						</Button>
// 					</div>
// 				)}
// 			</div>
// 			<div className='flex flex-wrap items-center gap-4 justify-between mb-4'>
// 				<div className='flex flex-wrap gap-4 sm:gap-6 pb-1 overflow-x-auto scrollbar-hide'>
// 					{tabs.map((tab) => (
// 						<button
// 							key={tab.id}
// 							className={`pb-2 px-1 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
// 								activeTab === tab.id
// 									? "text-[#692E9F] border-b-2 border-purple-800"
// 									: "text-gray-600 hover:text-purple-600"
// 							}`}
// 							onClick={() => handleTabChange(tab.id)}
// 						>
// 							{tab.label}
// 						</button>
// 					))}
// 				</div>
// 				{activeTab === "salary" ||
// 					activeTab === "tax" ||
// 					activeTab === "pension"}
// 			</div>
// 			<div className='mt-4'>
// 				<TanTable
// 					columnData={getColumns()}
// 					data={getData() || []}
// 					showSearch
// 					className='w-full'
// 					loadingState={false}
// 				/>
// 			</div>
// 			<ActionModal
// 				isOpen={isActionModalOpen}
// 				onClose={() => setIsActionModalOpen(false)}
// 				onConfirm={handleActionConfirm}
// 				actionType={currentAction}
// 				loading={isUpdatingPayrollApproval || loading}
// 				month={currentMonth}
// 				year={currentYear}
// 				showMonthYear={activeTab === "tax" || activeTab === "pension"}
// 			/>
// 			<OTPApprovalModal
// 				isOpen={isOTPModalOpen}
// 				onClose={() => setIsOTPModalOpen(false)}
// 				approvalStatusId={parseInt(currentId || "")}
// 				url={
// 					activeTab === "salary"
// 						? `/user/verify-payroll-otp/${currentId}`
// 						: undefined
// 				}
// 				callback={() => {
// 					setIsOTPModalOpen(false);
// 					setIsActionModalOpen(false);
// 				}}
// 			/>
// 			<OTPApprovalModal
// 				isOpen={isBulkOTPModalOpen}
// 				onClose={() => setIsBulkOTPModalOpen(false)}
// 				approvalStatusId={parseInt(currentId || "")}
// 				url={`/user/verify-bulk-payroll-otp`}
// 				payload={{
// 					payroll_id: selectedItems,
// 				}}
// 				callback={() => {
// 					setIsBulkOTPModalOpen(false);
// 					getPendingPayroll(true);
// 					setSelectedItems([]);
// 				}}
// 			/>

// 			{/* Bulk Action Modal */}
// 			<BulkActionModal
// 				isOpen={isBulkActionModalOpen}
// 				onClose={() => setIsBulkActionModalOpen(false)}
// 				onConfirm={handleBulkActionConfirm}
// 				actionType={bulkActionType}
// 				selectedCount={selectedItems.length}
// 				loading={loading}
// 			/>
// 		</div>
// 	);
// }
