'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LoanTable from '@/src/components/data/LoanMgt/LoanTable';
import LoanPolicyModal from '@/src/components/modals/LoanPolicyModal';
import SearchInput from '@/src/components/ui/SearchInput';
import { Plus, Trash2 } from 'lucide-react';
import NoDataState from '@/src/components/common/NoDataState';
import Image from 'next/image';
import { TbEdit } from 'react-icons/tb';
import { DeleteModal } from '@/src/components/modals/DeleteLoanPolicy';

const tabItems = ['Loan', 'Loan Policy'];
interface LoanPolicyData {
  policyName: string;
  eligibility: string;
  maxLoanLimit: string;
  repaymentMethod: string;
}

type ModalMode = 'add' | 'edit';

const LoanMgt = () => {
  const [tab, setTab] = useState(tabItems[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>('edit');
  const [loanId, setLoanId] = useState<number>();
  const [loanPolicies, setLoanPolicies] = useState<LoanPolicyData[]>([
    {
      policyName: 'Staff Emergency Loan Policy',
      eligibility: 'Must have completed 6 months of employment',
      maxLoanLimit: '₦150,000',
      repaymentMethod: 'Payroll Deduction',
    },
    {
      policyName: 'Senior Staff Loan Policy',
      eligibility: 'Must be in senior position for 2+ years',
      maxLoanLimit: '₦500,000',
      repaymentMethod: 'Bank Transfer',
    },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenAddModal = (): void => {
    setModalMode('add');
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (index: number): void => {
    setModalMode('edit');
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleSubmitLoanPolicy = (data: LoanPolicyData): void => {
    console.log(
      `${modalMode === 'add' ? 'Added' : 'Updated'} loan policy data:`,
      data
    );

    if (modalMode === 'add') {
      setLoanPolicies((prev) => [...prev, data]);
    } else if (editingIndex !== null) {
      setLoanPolicies((prev) =>
        prev.map((policy, index) => (index === editingIndex ? data : policy))
      );
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeletePolicy = () => {
    setLoanPolicies((prev) => prev.filter((_, i) => i !== loanId));
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = (index: number): void => {
    setIsDeleteModalOpen(true);
    setLoanId(index);
  };

  const getCurrentEditData = (): LoanPolicyData | undefined => {
    return editingIndex !== null ? loanPolicies[editingIndex] : undefined;
  };

  return (
    <div>
      {' '}
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl mb-8">
        Loan Management
      </h2>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-grow max-w-xs h-[40px]">
          <SearchInput
            placeholder="Search"
            value={searchTerm}
            setValue={setSearchTerm}
          />
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2"
        >
          <Plus /> <span>Create Loan Policy</span>
        </Button>
      </div>
      <ul className="flex gap-5 border-b  border-[#E4E7EC] pt-3 mt-8">
        {tabItems.map((item) => (
          <li
            key={item}
            className={`pb-3 text-sm font-semibold cursor-pointer ${
              tab === item && 'text-primary border-b border-primary'
            }`}
            onClick={() => setTab(item)}
          >
            {item}
          </li>
        ))}
      </ul>
      <section className="mt-5">
        {tab === 'Loan' ? (
          <LoanTable />
        ) : (
          <>
            {loanPolicies.length === 0 ? (
              <NoDataState
                icon={
                  <Image
                    src="/assets/emptystate.svg"
                    alt="Calendar"
                    width={58}
                    height={58}
                  />
                }
                header="Your Team Hasn’t Request For Loan Yet"
                subheader="Once your team request for loan, the record will appear here"
              />
            ) : (
              <div className="space-y-4">
                {loanPolicies.map((policy, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex gap-4">
                            <div className="w-32 flex-shrink-0">
                              <span className="text-sm text-gray-500">
                                Policy Name
                              </span>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm  text-gray-900 font-semibold">
                                {policy.policyName || `Policy #${index + 1}`}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-32 flex-shrink-0">
                              <span className="text-sm text-gray-500">
                                Eligibility
                              </span>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm text-gray-900 font-semibold">
                                {policy.eligibility || 'Not set'}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-32 flex-shrink-0">
                              <span className="text-sm text-gray-500">
                                Maximum Loan Limit
                              </span>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {policy.maxLoanLimit || 'Not set'}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-32 flex-shrink-0">
                              <span className="text-sm text-gray-500">
                                Repayment Method
                              </span>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm text-gray-900 font-semibold">
                                {policy.repaymentMethod || 'Not set'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleOpenDeleteModal(index)}
                          className="p-2 border text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete policy"
                        >
                          <Trash2 className="h-4 w-4 text-[#667085]" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(index)}
                          className="p-2 border text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                          title="Edit policy"
                        >
                          <TbEdit className="h-4 w-4 text-[#667085]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
      <LoanPolicyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitLoanPolicy}
        mode={modalMode}
        initialData={getCurrentEditData()}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Staff Emergency Loan Policy ?"
        description="This action is permanent and cannot be undone. Are you really want to delete this loan policy ?"
        onCancel={handleCancel}
        onDelete={handleDeletePolicy}
      />
    </div>
  );
};
export default LoanMgt;
