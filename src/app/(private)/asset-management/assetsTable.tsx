import React, { useMemo } from "react";
import { Asset } from "@/src/types/assets-management";
import { TableCell, TableRow } from "@/src/components/ui/table";
import CustomTable from "@/src/components/common/CustomTable";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import { RiDeleteBin6Line } from "react-icons/ri";

interface AssetTableProps {
  assets: Asset[];
  masterCheckbox?: boolean;
  setMasterCheckbox?: (checked: boolean) => void;
  onAssignAsset?: (assetId: string, employeeId: string) => void;
  onMasterCheckboxChange?: (checked: boolean) => void;
  isSuccess?: boolean;
  handleDelete?: (value: Asset) => void;
  isDeleting?: boolean;
}

export const AssetTable = ({
  assets,
  handleDelete,
  isDeleting,
}: AssetTableProps) => {
  const headers = useMemo(
    () => [
      { label: "Name" },
      { label: "Category" },
      { label: "Quantity" },
      { label: "Actions" },
    ],
    []
  );

  return (
    <div>
      <div className="mt-5">
        <CustomTable headers={headers}>
          {assets.length > 0 ? (
            assets.map((row) => (
              <TableRow
                key={row.id || row.name}
                className="text-[#1D2939] text-sm"
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  {handleDelete && (
                    <button
                      className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-8 h-8 rounded hover:border-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Delete ${row.id}`}
                      onClick={() => handleDelete(row)}
                      disabled={isDeleting}
                    >
                      <RiDeleteBin6Line
                        size={16}
                        className="text-gray-600 hover:text-red-500"
                      />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState headers={headers} messageTitle="No asset found" />
          )}
        </CustomTable>
      </div>
    </div>
  );
};

export default AssetTable;
