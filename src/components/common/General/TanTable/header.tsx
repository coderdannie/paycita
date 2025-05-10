import { ArrowUpDown } from "lucide-react";
import {
  Table,
  HeaderGroup,
  Header,
//   HeaderContext,
} from "@tanstack/react-table";
import { COLORS } from "../../colors";

interface TanHeaderProps<TData> {
  table: Table<TData>;
}

const TanHeader = <TData,>({ table }: TanHeaderProps<TData>) => {
  return (
    <thead className="bg-gray_1">
      {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(
            (header: Header<TData, unknown>, index: number) => (
              <th
                className="text-left dark:text-white text-black whitespace-nowrap"
                key={index}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="p-3 mx-2 rounded-md font-medium flex items-center gap-2">
                  {typeof header.column.columnDef.header === "function"
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
                  <ArrowUpDown size={16} color={COLORS.gray_3} />
                </div>
              </th>
            )
          )}
        </tr>
      ))}
    </thead>
  );
};

export default TanHeader;
