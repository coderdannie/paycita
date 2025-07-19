// "use client";

// import { useEffect} from "react";
// import { FiInfo } from "react-icons/fi";
// import { MdTune } from "react-icons/md";
// import { formatDate } from "@/src/utils/helper";
// import { useDashboard } from "@/src/context/dashboardContext";
// import TanTable from "@/src/components/common/General/TanTable";
// import { ProcurementRequestApproval } from "@/src/types/procurement";
// import { useAuthSelector } from "@/src/Redux/selectors";

// interface ProcurementTableProps {
// 	onInfoClick: (request: ProcurementRequestApproval) => void;
// 	title?: string;
// }

// export function ProcurementTable({ onInfoClick }: ProcurementTableProps) {
// 	const { user } = useAuthSelector();
// 	const { procurementRequests } = useDashboardSelector();
// 	const { getProcurementApproval, isFetchingProcurementApproval } =
// 		useDashboard();

// 	useEffect(() => {
// 		getProcurementApproval();
// 	}, []);

// 	const columns = [
// 		{
// 			header: "PN",
// 			accessorKey: "procurement_number",
// 		},

// 		{
// 			header: "Requested By",
// 			accessorKey: "user",
// 			cell: ({ row }: { row: { original: ProcurementRequestApproval } }) => (
// 				<span>{row.original.user.full_name}</span>
// 			),
// 		},
// 		{
// 			header: "Department",
// 			accessorKey: "user",
// 			cell: ({ row }: { row: { original: ProcurementRequestApproval } }) => (
// 				<span>{row.original.user.department}</span>
// 			),
// 		},
// 		{
// 			header: "Amount (₦)",
// 			accessorKey: "amount",
// 			cell: ({ row }: { row: { original: ProcurementRequestApproval } }) => (
// 				<span>
// 					{user?.user?.currency}
// 					{row.original.amount}
// 				</span>
// 			),
// 		},
// 		{
// 			header: "Date",
// 			accessorKey: "date",
// 			cell: ({ row }: { row: { original: ProcurementRequestApproval } }) => (
// 				<span>{formatDate(row.original.date)}</span>
// 			),
// 		},
// 		{
// 			header: "Status",
// 			accessorKey: "status",
// 			cell: ({ row }: { row: { original: ProcurementRequestApproval } }) => (
// 				<span
// 					className={`px-3 py-1 text-sm rounded-sm ${
// 						row.original.status === "approved"
// 							? "border border-[#89D8A9] text-[#00AA4F]"
// 							: row.original.status === "rejected"
// 							? "bg-red-100 text-red-800"
// 							: "border-[#FFD384] border text-[#FFA80A]"
// 					}`}
// 				>
// 					{row.original.status}
// 				</span>
// 			),
// 		},
// 		{
// 			header: "Actions",
// 			accessorKey: "actions",
// 			cell: ({ row }: { row: { original: ProcurementRequestApproval } }) => (
// 				<button
// 					className='text-gray-400 hover:text-gray-600 border rounded py-1 px-1'
// 					onClick={() => onInfoClick(row.original)}
// 				>
// 					<FiInfo size={20} />
// 				</button>
// 			),
// 		},
// 	];

// 	const rightComp = (
// 		<button className='flex items-center justify-center gap-2 px-4 py-2 border border-[#692E9F] text-[#692E9F] rounded hover:bg-purple-50'>
// 			<span>Filter</span>
// 			<MdTune />
// 		</button>
// 	);

// 	return (
// 		<div className='max-w-full'>
// 			<TanTable
// 				columnData={columns}
// 				data={procurementRequests || []}
// 				className='w-full'
// 				showSearch={true}
// 				rightComp={rightComp}
// 				length={10}
// 				loadingState={isFetchingProcurementApproval}
// 			/>
// 		</div>
// 	);
// }
