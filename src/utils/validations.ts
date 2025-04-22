import * as z from 'zod';

export const userDetailsSchema = z.object({
  full_name: z.string().min(1, { message: 'Full Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone_number: z
    .string()
    .min(1, { message: 'Phone Number is required' })
    .regex(/^\d{10,15}$/, { message: 'Invalid phone number' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  marital_status: z.string().min(1, { message: 'Marital Status is required' }),
  address: z.object({
    country: z.string().min(1, { message: 'Country is required' }),
    residentialAddress: z
      .string()
      .min(1, { message: 'Residential Address is required' }),
  }),
  emergencyContact: z.object({
    emergency_contact_name: z
      .string()
      .min(1, { message: 'Emergency Contact Name is required' }),
    emergency_contact_relationship: z
      .string()
      .min(1, { message: 'Relationship is required' }),
    emergency_contact_phone: z
      .string()
      .min(1, { message: 'Phone Number is required' })
      .regex(/^\d{10,15}$/, { message: 'Invalid phone number' }),
  }),
  guarantors: z
    .array(
      z.object({
        fullName: z.string().min(1, { message: 'Full Name is required' }),
        address: z.string().min(1, { message: 'Address is required' }),
        phoneNumber: z
          .string()
          .min(1, { message: 'Phone Number is required' })
          .regex(/^\d{10,15}$/, { message: 'Invalid phone number' }),
        relationship: z
          .string()
          .min(1, { message: 'Relationship is required' }),
      })
    )
    .min(2, { message: 'Exactly two guarantors are required' })
    .max(2, { message: 'Maximum two guarantors allowed' }),
});

export type userDetailsSchemaType = z.infer<typeof userDetailsSchema>;

export const employeeDetailsSchema = z.object({
  // employeeNumber: z.string().min(1, { message: "Employee Number is required" }),
  job_title: z.string().min(1, { message: 'Job Title is required' }),
  job_level: z.string().min(1, { message: 'Job Level is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  department_id: z.number().min(1, { message: 'Department is required' }),
  company_email: z.string().email({ message: 'Invalid email address' }),
  employment_type: z
    .string()
    .min(1, { message: 'Employment Type is required' }),
  job_location: z.string().min(1, { message: 'Location Type is required' }),
  hire_date: z.string().min(1, { message: 'Hire Date is required' }), // Assuming hire date is a string (e.g., YYYY-MM-DD)
  salary: z.string().min(1, { message: 'Basic Salary is required' }),
  tax_status: z.string().min(1, { message: 'Tax Status is required' }),
  tax_number: z.string().min(1, { message: 'Tax Number is required' }),

  pension_company: z
    .string()
    .min(1, { message: 'Pension Company is required' }),
  offer_letter: z.string().optional(),
});

export type EmployeeDetailsSchemaType = z.infer<typeof employeeDetailsSchema>;

export type AddEmployee = userDetailsSchemaType | EmployeeDetailsSchemaType;

export const loginSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
  })
  .required();

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const resumptionDetailsSchema = z.object({
  resumption_time: z.string().min(1, { message: 'Clock In is required' }),
  closing_time: z.string().min(1, { message: 'Clock Out is required' }),
});
export type ResumptionDetailsSchemaType = z.infer<
  typeof resumptionDetailsSchema
>;

export const topupSchema = z.object({
  networkProvider: z.string().min(1, 'Network provider is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  amount: z.string().min(1, 'Amount is required').optional(),
  dataPlan: z.string().min(1, 'Data plan is required').optional(),
});

export type TopupSchemaType = z.infer<typeof topupSchema>;

export const employeeFilterSchema = z.object({
  status: z.string().optional(),
  job_title: z.string().optional(),
});

export type EmployeeFilterSchemaType = z.infer<typeof employeeFilterSchema>;

export const eventSchema = (notificationType: string) => {
  return z.object({
    event_name: z.string().min(1, { message: 'Event Name is required' }),
    description: z.string().min(1, {
      message: 'Description is required',
    }),
    date: z.string().min(1, { message: 'Date is required' }),
    // start_time: z.string().min(1, { message: "Start Time is required" }),
    time: z.string().min(1, { message: 'End Time is required' }),
    meeting_link: z.string().min(1, {
      message: 'Meeting Link is required',
    }),
    notification_type: z.string().min(1, {
      message: 'Notification Type is required',
    }),
    department_id:
      notificationType === 'department'
        ? z.string().min(1)
        : z.string().optional(),

    emails:
      notificationType === 'emails' ? z.string().min(1) : z.string().optional(),
  });
};

export type EventSchemaType = z.infer<ReturnType<typeof eventSchema>>;

export const leaveRequestSchema = z.object({
  leave_type: z.string().min(1, { message: 'Leave Type is required' }),
  start_date: z.string().min(1, { message: 'Start Date is required' }),
  end_date: z.string().min(1, { message: 'End Date is required' }),
});

export type LeaveRequestSchemaType = z.infer<typeof leaveRequestSchema>;

export const loanApplicationSchema = z.object({
  amount: z.string().min(1, { message: 'Loan amount is required.' }).trim(),

  loan_payment_plan: z
    .string()
    .min(1, { message: 'Repayment period is required.' })
    .trim(),

  loan_purpose: z
    .string()
    .min(1, { message: 'Loan purpose is required.' })
    .trim(),

  salary_deduction_agreement: z.literal(true, {
    errorMap: () => ({
      message: 'You must agree to the terms and conditions.',
    }),
  }),
});

export type LoanApplicationSchemaType = z.infer<typeof loanApplicationSchema>;

export const procurementItemSchema = z.object({
  id: z.string(),
  item: z.string().min(1, 'Item is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z
    .union([
      z.number(),
      z.string().min(1, {
        message: 'Quantity must be greater than 0',
      }),
    ])
    .refine((val) => Number(val) > 0, {
      message: 'Quantity must be greater than 0',
    }),
  price: z
    .union([
      z.number(),
      z.string().min(1, {
        message: 'Unit Price must be greater than 0',
      }),
    ])
    .refine((val) => Number(val) > 0, {
      message: 'Unit Price must be greater than 0',
    }),
  total: z.number().optional(),
});

export type ProcurementItemSchemaType = z.infer<typeof procurementItemSchema>;

export const procurementSchema = z.object({
  procurement_date: z.date({ required_error: 'Procurement date is required' }),
  expected_delivery_date: z
    .date({ required_error: 'Expected delivery date is required' })
    .superRefine((val, ctx) => {
      if (val < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Date must be in the future',
        });
      }
    }),
  vendor_id: z.string().min(1, 'Vendor is required'),
  details: z
    .array(procurementItemSchema)
    .min(1, 'At least one item is required'),
});

export type ProcurementForm = z.infer<typeof procurementSchema>;

export const expenseSchema = z.object({
  details: z
    .array(procurementItemSchema)
    .min(1, 'At least one item is required'),
});

export type ExpenseForm = z.infer<typeof expenseSchema>;

export const approvalFilterSchema = z.object({
  leave_type: z.string().min(1, { message: 'Leave type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  start_date: z.string().min(1, { message: 'Start date is required' }),
  end_date: z.string().min(1, { message: 'End date is required' }),
});

export type ApprovalFilterSchemaType = z.infer<typeof approvalFilterSchema>;

export const walletFilterSchema = z.object({
  expense_type: z.string().min(1, { message: 'Expense type is required' }),
  transaction_type: z
    .string()
    .min(1, { message: 'Transaction type is required' }),
  status: z.string().min(1, { message: 'Status date is required' }),
});

export type WalletFilterSchemaType = z.infer<typeof walletFilterSchema>;

export const requestFundSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  reason: z.string().min(1, 'Reason is required'),
  date: z.string().min(1, 'Date is required'),
});

export type RequestFundSchemaType = z.infer<typeof requestFundSchema>;
