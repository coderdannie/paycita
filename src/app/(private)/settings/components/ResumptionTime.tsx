import {
  useAddResumptionDate,
  useGetResumptionTime,
} from "@/src/api/hooks/settings/useSettings";
import { CustomFormField } from "@/src/components/common/CustomInput";
import { Form } from "@/src/components/ui/form";
import {
  resumptionDetailsSchema,
  ResumptionDetailsSchemaType,
} from "@/src/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "react-activity";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Resumption = () => {
  const { resumptionDate } = useGetResumptionTime();

  const form = useForm<ResumptionDetailsSchemaType>({
    resolver: zodResolver(resumptionDetailsSchema),
    defaultValues: {
      resumption_time: resumptionDate.resumption_time,
      closing_time: resumptionDate.closing_time,
    },
  });

  const { control, formState } = form;
  const { errors } = formState;

  const { mutate: mutateAddResumption, isPending } = useAddResumptionDate();

  function onSubmit(values: ResumptionDetailsSchemaType) {
    console.log(values);
    mutateAddResumption(
      values as {
        resumption_time: string;
        closing_time: string;
      },
      {
        onSuccess: (res) => {
          toast.success(res.data.message);
        },

        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  }

  return (
    <div className="h-[300px] relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-5 pb-5  max-w-[800px] w-full">
            <CustomFormField
              label="Clock-In"
              name="resumption_time"
              control={control}
              placeholder="7:30"
              error={errors.resumption_time?.message}
            />
            <CustomFormField
              label="Clock-Out"
              name="closing_time"
              control={control}
              placeholder="7:30"
              error={errors.closing_time?.message}
            />
          </div>

          <div className="flex gap-4 md:justify-end h-[40px] absolute bottom-0 right-0">
            <button
              disabled={isPending}
              className={`btn-primary px-[30px] flex items-center gap-3`}
            >
              {isPending && <Spinner />} Update
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default Resumption;
