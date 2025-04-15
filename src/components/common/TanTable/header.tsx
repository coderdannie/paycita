import { COLORS } from "@/constants/colors";
import { ArrowUpDown } from "lucide-react";
import { FC } from "react";

interface TanHeaderProps {
	table: any;
}

const TanHeader: FC<TanHeaderProps> = ({ table }) => {
	return (
		<thead className='bg-gray_1'>
			{table.getHeaderGroups().map((headerGroup: any) => (
				<tr className='' key={headerGroup.id}>
					{headerGroup.headers.map((header: any, index: number) => (
						<th
							className='text-left dark:text-white text-black whitespace-nowrap'
							key={index}
							onClick={header.column.getToggleSortingHandler()}
						>
							<div className='p-3 mx-2 rounded-md font-medium flex items-center gap-2'>
								{header.column.columnDef.header}
								<ArrowUpDown size={16} color={COLORS.gray_3} />
							</div>
						</th>
					))}
				</tr>
			))}
		</thead>
	);
};

export default TanHeader;
