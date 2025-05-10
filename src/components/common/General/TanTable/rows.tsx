import { FC, MouseEvent } from "react";
import { Table, Row, Cell, flexRender } from "@tanstack/react-table"; // Import Table type

// Define the Asset type (replace this with your actual type)
interface Asset {
  id: string;
  name: string;
  category: string;
  quantity: number;
  assignedTo: {
    id: string;
    name: string;
  };
  avatarUrl?: string;
}

interface TanRowsProps {
  table: Table<Asset>; // Use Table from TanStack with your data type (Asset)
  onClick?: (event: MouseEvent<HTMLTableRowElement>) => void;
}

const TanRows: FC<TanRowsProps> = ({ table, onClick }) => {
  return (
    <tbody>
      {table.getRowModel().rows.map((row: Row<Asset>, index: number) => (
        <tr
          className={`${index % 2 !== 0 ? "" : ""}`}
          key={row.id} // Use row.id as the key to ensure uniqueness
          onClick={onClick ? onClick : undefined}
        >
          {row.getVisibleCells().map((cell: Cell<Asset, unknown>) => (
            <td
              className="border-t-[1px] border-t-gray-200"
              key={cell.id} // Use cell.id as the key to ensure uniqueness
              style={{ width: cell.column.getSize() }}
            >
              <div className="truncate-text whitespace-nowrap p-3 m-2 rounded-md">
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
