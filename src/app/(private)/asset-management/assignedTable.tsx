import { useMemo } from 'react';
import { Asset, AssignedAsset, Employee } from '@/src/types/assets-management';
import { InfoIcon } from '@/src/assets/Icons';
import CustomTable from '@/src/components/common/CustomTable';
import { TableCell, TableRow } from '@/src/components/ui/table';
import Image from 'next/image';

interface Props {
  employees: Employee[];
  assets: Asset[];
  onInfoClick: (asset: Asset) => void;
  assignedAssets: AssignedAsset[];
}

export const AssignedTable = ({ assignedAssets, onInfoClick }: Props) => {
  const headers = useMemo(
    () => [
      { label: 'Asset ID' },
      { label: 'Asset Name' },
      { label: 'Category' },
      { label: 'Assigned To' },
      { label: '' },
    ],
    []
  );

  const handleInfoClick = (assignedAsset: AssignedAsset) => {
    const asset: Asset = {
      id: assignedAsset.asset_id,
      name: assignedAsset.asset_name,
      category: assignedAsset.category,
      quantity: 1,
      status: 'assigned',
      assignedTo: {
        id: assignedAsset.assigned_to.id,
        name: assignedAsset.assigned_to.full_name,
      },
      avatarUrl: assignedAsset.assigned_to.profile_picture,
    };
    onInfoClick(asset);
  };

  return (
    <div>
      <div className="mt-5">
        <CustomTable headers={headers}>
          {assignedAssets?.length > 0 ? (
            assignedAssets?.map((row) => (
              <TableRow key={row.id} className="text-[#1D2939] text-sm">
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.asset_name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        row.assigned_to.profile_picture ||
                        'https://via.placeholder.com/40'
                      }
                      alt={row.assigned_to?.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                      width={100}
                      height={100}
                    />
                    <span>{row.assigned_to?.full_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleInfoClick(row)}
                    className="text-indigo-500 hover:underline"
                  >
                    <InfoIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center">
                No assigned assets found
              </TableCell>
            </TableRow>
          )}
        </CustomTable>
      </div>
    </div>
  );
};
