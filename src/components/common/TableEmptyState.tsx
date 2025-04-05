/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useMemo } from "react";
import Image from "next/image";
import { TableCell, TableRow } from "../ui/table";

interface TableEmptyStateProps {
  headers: any[]; // Consider using a more specific type if possible
}

export default function TableEmptyState({ headers }: TableEmptyStateProps) {
  const renderEmptyState = useMemo(
    () => (
      <TableRow>
        <TableCell colSpan={headers?.length} className="text-center py-6">
          <div className="flex flex-col justify-center items-center w-full">
            <Image
              src="/assets/emptystate.svg"
              alt="No Matching Records"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-lg font-semibold text-gray-700">
              No Matching Records Found
            </p>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        </TableCell>
      </TableRow>
    ),
    [headers?.length]
  );

  return renderEmptyState;
}
