import { useMemo } from 'react';
import { Asset, AssignedAsset, Employee } from '@/src/types/assets-management';
import { InfoIcon } from '@/src/assets/Icons';
import CustomTable from '@/src/components/common/CustomTable';
import { TableCell, TableRow } from '@/src/components/ui/table';
import Image from 'next/image';
import TableEmptyState from '@/src/components/common/TableEmptyState';

interface Props {
  employees: Employee[];
  assets: Asset[];
  onInfoClick: (asset: Asset, action: string) => void;
  assignedAssets: AssignedAsset[];
  setIsOpen: (prop: boolean) => void;
  setAssignId: (prop: string) => void;
}

export const AssignedTable = ({
  assignedAssets,
  onInfoClick,
  setAssignId,
}: Props) => {
  const headers = useMemo(
    () => [
      { label: 'Asset ID' },
      { label: 'Asset Name' },
      { label: 'Category' },
      { label: 'Assigned To' },
      { label: 'Actions' },
    ],
    []
  );

  const handleInfoClick = (assignedAsset: AssignedAsset, action: string) => {
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
    onInfoClick(asset, action);
    setAssignId(assignedAsset.id.toString());
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
                <TableCell className="flex gap-4">
                  <button
                    onClick={() => handleInfoClick(row, 'view')}
                    className="text-indigo-500 hover:underline"
                  >
                    <InfoIcon />
                  </button>
                  <button
                    onClick={() => handleInfoClick(row, 'Revoke')}
                    className="border-red-500  text-red-500 rounded-md border bg-white  p-2"
                  >
                    Revoke Asset
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState
              headers={headers}
              messageTitle="No assigned assets found"
            />
          )}
        </CustomTable>
      </div>
    </div>
  );
};
