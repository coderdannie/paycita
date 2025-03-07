import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import TableSkeleton from '../ui/Loaders/TableSkeleton';
import Image from 'next/image';

interface Header {
  label: string;
  filterOptions?: string[]; // If provided, a dropdown filter is shown
  onFilterChange?: (value: string) => void; // Callback for filter changes
}

interface CustomTableProps {
  headers: Header[]; // Table headers with optional filter dropdown
  isLoading?: boolean; // Loading state
  skeletonRows?: number; // Number of skeleton rows to show during loading
  children?: React.ReactNode; // Table body content provided by the parent
}

const CustomTable: React.FC<CustomTableProps> = ({
  headers,
  isLoading = false,
  children,
}) => {
  return (
    <div className="relative w-full overflow-x-auto">
      <div className="w-full overflow-scroll min-h-86 rounded-lg border">
        <Table className="w-full capitalize font-semibold min-w-[600px]">
          {/* Table Header */}
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="relative min-w-[150px] py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#1D2939] font-semibold truncate">
                      {header.label}
                    </span>
                    {header.filterOptions && (
                      <Select onValueChange={header.onFilterChange}>
                        <SelectTrigger className="h-8 border-0 w-fit text-sm relative">
                          <SelectValue />

                          {/* Custom Dropdown Icon */}
                          <Image
                            src="/assets/sort-fill.png"
                            alt="Dropdown"
                            className="w-4 h-4 ml-2 z-50 absolute right-2 top-1/2 -translate-y-1/2"
                            width={16}
                            height={16}
                          />
                        </SelectTrigger>
                        <SelectContent className=" z-50 bg-white">
                          {header.filterOptions.map((option, i) => (
                            <SelectItem key={i} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {isLoading ? (
              // Show Skeleton Rows if Loading
              <TableSkeleton headers={headers} />
            ) : (
              // Render Children as Table Body
              children
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomTable;
