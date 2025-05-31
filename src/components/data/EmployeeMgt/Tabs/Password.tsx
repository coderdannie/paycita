'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ResetPassword from '@/src/components/modals/ResetPasswordModal';
import { useResetEmployeePassword } from '@/src/hooks/dashboard/useDashboard';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface Props {
  id: string;
}
const Password = ({ id }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading } = useResetEmployeePassword({
    onSuccess: (res: any) => {
      toast.success(res?.message);
      setIsOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    },
  });

  const handleReset = () => {
    mutate({
      userId: id,
    });
  };

  return (
    <div className="min-h-[236px] border bg-white border-[#E4E7EC] pt-6 px-5 rounded-xl gap-4">
      <div className="flex justify-between items-center flex-wrap">
        <div>
          <h2 className="font-medium max-w-[600px] w-full">
            Please ensure that the user has requested a password reset or has
            given consent.
          </h2>
        </div>
        <Button
          className="flex gap-1 items-center"
          onClick={() => setIsOpen(true)}
        >
          Reset Password
        </Button>
      </div>
      <ResetPassword
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleReset={handleReset}
        isPending={isLoading}
      />
    </div>
  );
};
export default Password;
