
import React, { useState } from "react";
import TableHeader from "./tableHeader";
import StatusBadge from "./statusBadge";
import { PayrollEntry } from "@/src/types/payrollEntry";

interface SalaryTableProps {
	data: PayrollEntry[];
	onApprove: (entry: PayrollEntry) => void;
	onReject: (entry: PayrollEntry) => void;
	onChangeStatus: (entry: PayrollEntry) => void;
}

const SalaryTable: React.FC<SalaryTableProps> = ({
	data,
	onApprove,
	onReject,
	onChangeStatus,
}) => {
	const [selectAll, setSelectAll] = useState(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const handleSelectAll = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);

		if (newSelectAll) {
			const allIds = data.map((_, index) => index.toString());
			setSelectedRows(allIds);
		} else {
			setSelectedRows([]);
		}
	};

	const handleSelectRow = (index: string) => {
		if (selectedRows.includes(index)) {
			setSelectedRows(selectedRows.filter((id) => id !== index));
			setSelectAll(false);
		} else {
			setSelectedRows([...selectedRows, index]);
			if (selectedRows.length + 1 === data.length) {
				setSelectAll(true);
			}
		}
	};

	const formatCurrency = (amount: number) => {
		return `₦${amount.toLocaleString()}`;
	};

	return (
		<div className='mt-4 overflow-x-auto'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-4 py-3 w-10'>
							<input
								type='checkbox'
								className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
								checked={selectAll}
								onChange={handleSelectAll}
							/>
						</th>
						<TableHeader label='Period' />
						<TableHeader label='Employee Name' />
						<TableHeader label='Base Salary' />
						<TableHeader label='Allowance' />
						<TableHeader label='Deductions' />
						<TableHeader label='Netpay' />
						<th className='px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider'>
							Status
						</th>
						<TableHeader label='Action Time' />
						<th className='px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider'>
							Action
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{data.map((entry, index) => (
						<tr key={index} className='hover:bg-gray-50'>
							<td className='px-4 py-4'>
								<input
									type='checkbox'
									className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
									checked={selectedRows.includes(index.toString())}
									onChange={() => handleSelectRow(index.toString())}
								/>
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
								{entry.date}
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
								{entry.staff_name}
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
								{formatCurrency(Number(entry.gross_income))}
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
								{/*   {formatCurrency(Number(entry.allowance))} */}
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
								{formatCurrency(Number(entry.deductions))}
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
								{formatCurrency(Number(entry.net_pay))}
							</td>
							<td className='px-4 py-4 whitespace-nowrap'>
								<StatusBadge
									status={entry.status as "Pending" | "Approved" | "Rejected"}
								/>
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
								{entry.date}
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
								{entry.status === "Pending" ||
								entry.status === "Rejected" ||
								entry.status === "Approved" ? (
									<div className='flex space-x-2'>
										<button
											onClick={() => onApprove(entry)}
											className='bg-[#692E9F] text-white py-2 px-3 rounded text-xs'
										>
											Approve
										</button>
										<button
											onClick={() => onReject(entry)}
											className='border border-[#970404] text-[#970404] py-2 px-3 rounded text-xs'
										>
											Reject
										</button>
									</div>
								) : (
									<button
										onClick={() => onChangeStatus(entry)}
										className='bg-[#692E9F] text-white py-2 px-3 rounded text-xs'
									>
										Change status
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default SalaryTable;
