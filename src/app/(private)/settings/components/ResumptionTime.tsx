import { CustomFormField } from '@/src/components/common/CustomInput';
import { Form } from '@/src/components/ui/form';
import {
  resumptionDetailsSchema,
  ResumptionDetailsSchemaType,
} from '@/src/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const Resumption = () => {
  const form = useForm<ResumptionDetailsSchemaType>({
    resolver: zodResolver(resumptionDetailsSchema),
    defaultValues: {
      clockIn: '',
      clockOut: '',
    },
  });

  const { control, formState } = form;
  const { errors } = formState;

  function onSubmit(values: ResumptionDetailsSchemaType) {
    console.log(values);
  }

  return (
    <div className="h-[300px] relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-5 pb-5  max-w-[800px] w-full">
            <CustomFormField
              label="Clock-In"
              name="clockIn"
              control={control}
              placeholder="7:30"
              error={errors.clockIn?.message}
            />
            <CustomFormField
              label="Clock-Out"
              name="clockOut"
              control={control}
              placeholder="7:30"
              error={errors.clockOut?.message}
            />
          </div>

          <div className="flex gap-4 md:justify-end h-[40px] absolute bottom-0 right-0">
            <button className={`btn-primary px-[30px] `}>Update</button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default Resumption;
