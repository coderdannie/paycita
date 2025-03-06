import { Skeleton } from '../skeleton';
import { TableCell, TableRow } from '../table';

interface Header {
  label: string;
  filterOptions?: string[]; // If provided, a dropdown filter is shown
  onFilterChange?: (value: string) => void; // Callback for filter changes
}

const TableSkeleton = ({ headers }: { headers: Header[] }) => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {headers.map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-8 w-full rounded-md" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
