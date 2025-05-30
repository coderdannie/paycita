'use client';

import { useCallback, useMemo, useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import TableEmptyState from '../../common/TableEmptyState';
import { Button } from '@/components/ui/button';
import ReimbursementDetails from '../../modals/ReimbursementDetails';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useUpdateApproval } from '@/src/hooks/approvals/useApprovals';
import RejectModal from '../../modals/RejectModal';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import ApprovalModal from '../../modals/VerifyOtpModal';
import {
  useVerifyApprovalOtp,
  useResendApprovalOtp,
} from '../../../hooks/approvals/useApprovals';

const ReimbursementTable = ({
  approvals,
}: {
  approvals: Array<{
    amount: string;
    approval_status_id: string;
    date_of_purchase: string;
    description: string;
    employee_name: string;
    re_imbursement_id: string;
    rb_number: string;
    status: string;
  }>;
}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [dataId, setDataId] = useState('');

  const headers = useMemo(
    () => [
      { label: 'RN' },
      { label: 'Amount' },
      { label: 'Description' },
      { label: 'Employee Name' },
      { label: 'Date' },
      { label: 'Status' },
      { label: 'Action' },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] w-[70%] text-center block px-[10px] rounded-md 
        ${
          status === 'approved'
            ? 'text-[#008000] bg-[#EDFCED]'
            : status === 'pending'
            ? 'text-[#5252FF] bg-[#EDEDFB]'
            : 'text-red-600 bg-[#FFF5F5]'
        }`}
      >
        {status}
      </span>
    );
  }, []);

  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval('update-reimbursement-requests');

  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const [approvalId, setApprovalId] = useState('');

  const handleReject = (comment: string) => {
    const payload = {
      id: approvalId,
      data: {
        status: 'rejected',
        reason: comment,
      },
    };
    mutateUpdateApprovalStatus(payload, {
      onSuccess: () => {
        toast.success('Status updated successfully');
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.GET_ALL_APPROVALS,
            'pending-reimbursement-requests',
          ],
        });
        setIsRejectOpen(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        }
      },
    });
  };

  const { mutate: mutateVerifyOtp, isPending: isVerifying } =
    useVerifyApprovalOtp({
      onSuccess: (res: any) => {
        toast.success(res?.data?.message);
        setIsShow(false);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS],
        });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        }
      },
    });

  const { mutate: mutateResendOtp, isLoading } = useResendApprovalOtp({
    onSuccess: (res: any) => {
      toast.success(res?.message);
      setTimeLeft(180);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    },
  });

  const handleVerify = (otpValue: string) => {
    mutateVerifyOtp({
      otp: otpValue,
    });
  };

  const handleResendOtp = () => {
    mutateResendOtp({
      id: dataId,
    });
  };
  const handleApprove = () => {
    const payload = {
      id: approvalId,
      data: {
        status: 'approved',
      },
    };
    mutateUpdateApprovalStatus(payload, {
      onSuccess: (res: any) => {
        toast.success(res?.data?.message);
        setTimeout(() => {
          if (res?.data?.data?.requires_otp) {
            setIsShow(true);
          }
        }, 200);
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.GET_ALL_APPROVALS,
            'pending-reimbursement-requests',
          ],
        });
        setIsOpen('');
        setApprovalId('');
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        }
      },
    });
  };

  return (
    <div className="mt-6">
      <CustomTable headers={headers}>
        {approvals?.length ? (
          approvals.map((row, index) => (
            <TableRow key={index} className="text-[#1D2939] text-sm">
              <TableCell className="text-primary">{row.rb_number}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.description || '-'}</TableCell>
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.date_of_purchase}</TableCell>
              <TableCell>{renderStatusBadge(row.status)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-primary"
                  onClick={() => {
                    setIsOpen(row.re_imbursement_id);
                    setApprovalId(row.approval_status_id);
                    setDataId(row?.approval_status_id);
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState headers={headers} />
        )}
      </CustomTable>
      <ReimbursementDetails
        isOpen={!!isOpen}
        onClose={() => setIsOpen('')}
        id={isOpen}
        onReject={() => setIsRejectOpen(true)}
        handleApprove={handleApprove}
        isLoading={isUpdatePending}
      />

      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleReject}
        isLoading={isUpdatePending}
      />
      <ApprovalModal
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        onVerify={handleVerify}
        isVerifying={isVerifying}
        onResend={handleResendOtp}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        isResending={isLoading}
      />
    </div>
  );
};

export default ReimbursementTable;
