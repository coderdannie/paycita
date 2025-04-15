import { flexRender } from "@tanstack/react-table";
import { FC, MouseEvent } from "react";

interface TanRowsProps {
	table: any;
	onClick?: (event: MouseEvent<HTMLTableRowElement>) => void;
}

const TanRows: FC<TanRowsProps> = ({ table, onClick }) => {
	return (
		<tbody className=''>
			{table.getRowModel().rows.map((row: any, index: number) => (
				<tr
					className={`${index % 2 !== 0 ? "" : ""} `}
					key={index}
					onClick={onClick ? onClick : undefined}
				>
					{row.getVisibleCells().map((cell: any, index: number) => (
						<td
							className='border-t-[1px] border-t-gray-200 bg-white'
							key={index}
							//@ts-ignore
							w={cell.column.getSize()}
						>
							<div className='truncate-text whitespace-nowrap  p-1 m-2 rounded-md'>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</div>
						</td>
					))}
				</tr>
			))}
		</tbody>
	);
};

export default TanRows;
