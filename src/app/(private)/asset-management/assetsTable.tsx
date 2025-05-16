import React, { useMemo } from 'react';
import { Asset } from '@/src/types/assets-management';
import { TableCell, TableRow } from '@/src/components/ui/table';
import CustomTable from '@/src/components/common/CustomTable';

interface AssetTableProps {
  assets: Asset[];
  masterCheckbox?: boolean;
  setMasterCheckbox?: (checked: boolean) => void;
  onAssignAsset?: (assetId: string, employeeId: string) => void;
  onMasterCheckboxChange?: (checked: boolean) => void;
  isSuccess?: boolean;
}

export const AssetTable = ({ assets }: AssetTableProps) => {
  const headers = useMemo(
    () => [
      { label: 'Name' },
      { label: 'Category' },
      { label: 'Quantity' },
      { label: 'Status' },
    ],
    []
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'in stock':
        return 'text-green-600 border-[#89D8A9] bg-[#F5FFFA]';
      case 'pending':
        return 'text-yellow-600 border-[#F4D03F] bg-[#FEF9E7]';
      default: // For Rejected or any other status
        return 'text-red-600 border-[#F49E9E] bg-[#FFF5F5]';
    }
  };

  return (
    <div>
      <div className="mt-5">
        <CustomTable headers={headers}>
          {assets?.length > 0 ? (
            assets?.map((row) => (
              <TableRow key={row.name} className="text-[#1D2939] text-sm">
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  {' '}
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer ${getStatusStyle(
                      row.status.toLocaleLowerCase()
                    )}`}
                  >
                    {row.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center">
                No assets found
              </TableCell>
            </TableRow>
          )}
        </CustomTable>
      </div>
    </div>
  );
};

export default AssetTable;
