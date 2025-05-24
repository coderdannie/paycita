import { useScrollLock } from '@/src/components/common/useScrollLock';
import { ReimbursementItem } from '@/src/types/reimbursement';
import { formatDate } from '@/src/utils/helper';
import { Download, X } from 'lucide-react';

interface ReimbursementDetailsProps {
  reimbursement?: ReimbursementItem;
  onClose: () => void;
}

const ReimbursementDetails: React.FC<ReimbursementDetailsProps> = ({
  reimbursement,
  onClose,
}) => {
  const isOpen = true;
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (reimbursement.receiptUrl) {
      const a = document.createElement('a');
      a.href = reimbursement.receiptUrl;
      a.target = '_blank';
      a.download = `receipt-${reimbursement.rn}.pdf`;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Reimbursement Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xs text-gray-500">Reimbursement</h3>
            <p className="font-medium text-lg">{`#${reimbursement?.reimbursement_number}`}</p>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <h3 className="text-xs text-gray-500 mb-1">Employee Name</h3>
              <p>{reimbursement?.employee_name}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs text-gray-500 mb-1">Date</h3>
              <p>{formatDate(reimbursement?.date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 mb-6">
            <div className="col-span-1">
              <h3 className="text-xs text-gray-500 mb-1">Department</h3>
              <p>{reimbursement?.department}</p>
            </div>
            <div className="col-span-1">
              <h3 className="text-xs text-gray-500 mb-1">Title</h3>
              <p>{reimbursement?.title}</p>
            </div>
            <div className="col-span-1 text-right">
              <h3 className="text-xs text-gray-500 mb-1">Status:</h3>
              <span className="text-xs px-3 py-2 rounded inline-block bg-[#EDFCED] text-[#008000]">
                {reimbursement?.status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs text-gray-500 mb-1">Description</h3>
            <p>{reimbursement?.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xs text-gray-500 mb-2">Receipt</h3>
            <div className="border border-gray-200 rounded-lg w-full">
              <div className="relative bg-gray-50 h-56">
                {reimbursement?.receiptUrl ? (
                  <div className="p-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs">20KB</span>
                      <button
                        onClick={handleDownload}
                        className="bg-[#692E9F] text-white rounded-full p-2 hover:bg-purple-700"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                    <div className="h-48">
                      {/* Receipt content would go here */}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    <p>Receipt not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleDownload}
              className="bg-[#692E9F] text-white rounded-md py-3 px-6 flex items-center justify-center"
            >
              Download <Download size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReimbursementDetails;
