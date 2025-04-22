import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  requestFundSchema,
  RequestFundSchemaType,
} from '@/src/utils/validations';
import { Button } from '@/src/components/ui/button';
import { CustomFormField } from '../common/CustomInput';
import { Form } from '../ui/form';
import Calendar from 'react-calendar';
import { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { formatDate } from '@/src/utils/helper';
import { TileArgs } from 'react-calendar';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RequestFundSchemaType) => void;
};

type CalendarTileArgs = TileArgs & {
  view: 'month' | 'year' | 'decade' | 'century';
};

export const RequestFundModal = ({ open, onClose, onSubmit }: Props) => {
  const form = useForm<RequestFundSchemaType>({
    resolver: zodResolver(requestFundSchema),
    defaultValues: {
      amount: '',
      reason: '',
      date: '',
    },
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { control, formState, handleSubmit, setValue } = form;
  const { errors } = formState;

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
    setValue('date', value.toISOString());
    setShowCalendar(false);
  };

  //disabled class for past dates
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today ? 'disabled-date' : null;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-lg p-6">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-lg font-semibold">
            Request Fund
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              label="Amount"
              name="amount"
              control={control}
              placeholder="#5000"
              error={errors.amount?.message}
            />

            <CustomFormField
              label="Reason for Request"
              name="reason"
              control={control}
              placeholder="For logistics"
              error={errors.reason?.message}
            />

            <div className="w-full box">
              <p className="font-semibold text-sm text-[#292D32] pb-2">
                Date Needed
              </p>
              <div className="w-full relative">
                <div
                  className={`flex gap-4 border-2 bg-[#ffff] border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer ${
                    selectedDate ? 'justify-between' : 'justify-end'
                  } items-center p-[10px]`}
                  onClick={() => setShowCalendar((prev) => !prev)}
                >
                  <p className="text-xs text-[#292D32]">
                    {selectedDate ? formatDate(selectedDate) : 'Pick date'}
                  </p>
                  <FiCalendar className="mr-2 h-4 w-4 text-[#5B5B5B]" />
                </div>

                {showCalendar && (
                  <div className="absolute bottom-full mb-2 w-full z-30">
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate || new Date()}
                      minDate={new Date()}
                      tileClassName={tileClassName}
                      className="border border-gray-200 rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
              {errors.date?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Request Fund
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
