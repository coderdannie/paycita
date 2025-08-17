import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BenefitsDialog } from '../modals/BenefitsModal';
import { Button } from '@/components/ui/button';
import {
  useAssignBenefit,
  useGetBenefits,
  useDeleteBenefitAssigned,
} from '@/src/hooks/benefit-mgt/useBenefit';
import { useParams, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { DeleteModal } from '@/src/components/modals/DeleteLoanPolicy';

interface Benefit {
  id: number;
  name: string;
  description: string;
  type: string;
  unit: string;
  allocation: string;
  recurring: string;
}

interface EmployeeBenefit {
  id: number;
  benefit: Benefit | null;
  total_usage: number;
}

type EmployeeBenefits = EmployeeBenefit[];

interface BenefitsProp {
  benefits: EmployeeBenefits;
  name?: string;
}

const EmployeeBenefits = ({ benefits, name }: BenefitsProp) => {
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [benefitToDelete, setBenefitToDelete] =
    useState<EmployeeBenefit | null>(null);

  const currentPage = searchParams.get('page') || '1';

  const { id } = useParams();
  const employeeId = id as string;

  // Filter out benefits where benefit is null and map to display format
  const { mutateAssignBenefit, isPending } = useAssignBenefit();
  const { mutate: mutateDeleteBenefitAssigned, isPending: isDeleting } =
    useDeleteBenefitAssigned();

  const assignedBenefits = benefits
    .filter((item) => item.benefit !== null)
    .map((item) => ({
      id: item.id,
      name: item.benefit!.name,
      description: item.benefit!.description,
      type: item.benefit!.type,
      allocation: `${item.benefit!.allocation} ${item.benefit!.unit}`,
      usage: `${item.total_usage} / ${item.benefit!.allocation}`,
      recurring:
        item.benefit!.recurring.charAt(0).toUpperCase() +
        item.benefit!.recurring.slice(1),
      progress: item.benefit!.allocation
        ? Math.round(
            (item.total_usage / parseInt(item.benefit!.allocation)) * 100
          )
        : 0,
      status: 'Active',
    }));

  const handleAssignBenefits = (benefitIds: string[]) => {
    mutateAssignBenefit(
      {
        employee_id: employeeId,
        benefit_ids: benefitIds.map(String),
      },
      {
        onSuccess: () => {
          setSelectedBenefits([]);
          setDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteBenefit = (benefit: any) => {
    const originalBenefit = benefits.find((item) => item.id === benefit.id);
    if (originalBenefit) {
      setBenefitToDelete(originalBenefit);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!benefitToDelete) return;

    mutateDeleteBenefitAssigned(benefitToDelete.id.toString(), {
      onSuccess: () => {
        toast.success('Benefit removed successfully!');
        setIsDeleteModalOpen(false);
        setBenefitToDelete(null);
      },
      onError: (error) => {
        toast.error('Failed to remove benefit');
        console.error('Delete error:', error);
      },
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBenefitToDelete(null);
  };

  const { benefits: allBenefits } = useGetBenefits({
    page: currentPage.toString(),
  });

  return (
    <div>
      {/* Employee Benefits Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Employee Benefits
            </h2>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              <span>ASSIGN BENEFITS</span>
            </Button>
          </div>
        </div>

        <div className="p-6">
          {assignedBenefits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 italic">No benefits assigned yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                Assigned Benefits ({assignedBenefits.length})
              </div>

              {assignedBenefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {benefit.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        {benefit.status}
                      </span>
                      <button
                        onClick={() => handleDeleteBenefit(benefit)}
                        disabled={isDeleting}
                        className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Remove ${benefit.name} benefit`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-medium">{benefit.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Recurring:</span>
                      <p className="font-medium">{benefit.recurring}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Allocation:</span>
                      <p className="font-medium">{benefit.allocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Usage:</span>
                      <p className="font-medium">{benefit.usage}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-500">Usage Progress</span>
                      <span className="text-gray-700">{benefit.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${benefit.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BenefitsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employeeName={name}
        availableBenefits={allBenefits}
        selectedBenefits={selectedBenefits}
        onSelectedBenefitsChange={setSelectedBenefits}
        onAssign={handleAssignBenefits}
        isPending={isPending}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Remove Benefit"
        description={`Are you sure you want to remove "${benefitToDelete?.benefit?.name}" from this employee? This action cannot be undone.`}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default EmployeeBenefits;
