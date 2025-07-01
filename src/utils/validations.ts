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
        fullName: z.string(),
        address: z.string(),
        phoneNumber: z
          .string()
          .refine((val) => !val || val === '' || /^\d{10,15}$/.test(val), {
            message: 'Invalid phone number format',
          }),
        relationship: z.string(),
      })
    )
    .refine(
      (guarantors) => {
        // If no guarantors are provided, it's valid
        if (!guarantors || guarantors.length === 0) return true;

        // Check if any guarantor has any field filled
        const hasAnyGuarantorData = guarantors.some(
          (guarantor) =>
            guarantor.fullName ||
            guarantor.address ||
            guarantor.phoneNumber ||
            guarantor.relationship
        );

        // If no guarantor data is provided, it's valid (optional)
        if (!hasAnyGuarantorData) return true;

        // If any guarantor has data, validate that at least the first guarantor is complete
        const firstGuarantor = guarantors[0];
        return (
          firstGuarantor &&
          firstGuarantor.fullName &&
          firstGuarantor.address &&
          firstGuarantor.phoneNumber &&
          firstGuarantor.relationship
        );
      },
      {
        message:
          'If adding guarantors, please complete at least the first guarantor information',
      }
    )
    .optional(),
});

export type userDetailsSchemaType = z.infer<typeof userDetailsSchema>;

export const employeeDetailsSchema = z.object({
  job_title: z.string().min(1, { message: 'Job Title is required' }),
  job_level: z.string().min(1, { message: 'Job Level is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  department_id: z.number().min(1, { message: 'Department is required' }),
  company_email: z.string().optional(),
  employment_type: z
    .string()
    .min(1, { message: 'Employment Type is required' }),
  job_location: z.string().min(1, { message: 'Location Type is required' }),
  hire_date: z.string().min(1, { message: 'Hire Date is required' }), // Assuming hire date is a string (e.g., YYYY-MM-DD)
  salary: z.string().min(1, { message: 'Basic Salary is required' }),
  tax_status: z.string().min(1, { message: 'Tax Status is required' }),
  branch_id: z.number().min(1, { message: 'Branch is required' }),
  pension_number: z.string().optional(),

  pension_company: z.string().optional(),
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

export const topupSchema = z
  .object({
    network: z.string().min(1, 'Network provider is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    topupType: z.enum(['airtime', 'data']).default('airtime'),
    amount: z.string().optional(),
    dataPlan: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // For airtime, amount is required but dataPlan should be ignored
    if (data.topupType === 'airtime') {
      if (!data.amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Amount is required for airtime',
          path: ['amount'],
        });
      }
    }

    // For data, dataPlan is required but amount should be ignored
    if (data.topupType === 'data') {
      if (!data.dataPlan) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Data plan is required for data',
          path: ['dataPlan'],
        });
      }
    }
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
    date: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    meeting_link: z.string().optional().nullable(),
    notification_type: z.string().min(1, {
      message: 'Notification Type is required',
    }),
    department_id:
      notificationType === 'department'
        ? z.string().min(1)
        : z.string().optional().nullable(),
    emails:
      notificationType === 'emails'
        ? z.string().min(1)
        : z.string().optional().nullable(),
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
  loan_type: z.string().min(1, { message: 'Loan type is required.' }),
  amount: z.string().min(1, { message: 'Loan amount is required.' }).trim(),

  // loan_payment_plan: z
  //   .string()
  //   .min(1, { message: "Repayment period is required." })
  //   .trim(),

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

// Function to get the appropriate schema based on edit mode
export const getProcurementSchema = (isEditing: boolean) => {
  return z.object({
    procurement_date: z.date({
      required_error: 'Procurement date is required',
    }),
    // Conditionally validate expected_delivery_date
    expected_delivery_date: isEditing
      ? z.date().optional() // Optional when editing
      : z // Required and must be in the future when creating
          .date({ required_error: 'Expected delivery date is required' })
          .superRefine((val, ctx) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Compare dates only
            if (val < today) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Date must be today or in the future',
              });
            }
          }),
    // Conditionally validate vendor_id
    vendor_id: isEditing
      ? z.string().optional() // Optional when editing
      : z.string().min(1, 'Vendor is required'), // Required when creating
    details: z
      .array(procurementItemSchema)
      .min(1, 'At least one item is required'),
  });
};

// Define the type based on the function's return type for creation mode (or a generic one)
export type ProcurementForm = z.infer<ReturnType<typeof getProcurementSchema>>;

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

export const reimbursementFormSchema = z.object({
  amount: z
    .string()
    .min(1, { message: 'Amount is required' })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: 'Amount must be a valid number',
    }),
  date_of_purchase: z
    .string()
    .min(1, { message: 'Date of purchase is required' }),
  description: z.string().min(1, { message: 'Item description is required' }),
  reason: z
    .string()
    .min(1, { message: 'Reason for reimbursement is required' }),
  proof_of_payment: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: 'Proof of payment is required',
  }),
});

export type reimbursementFormSchemaType = z.infer<
  typeof reimbursementFormSchema
>;

// Define the asset schema with Zod
export const assetSchema = z.object({
  name: z.string().min(1, { message: 'Asset name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  quantity: z
    .string()
    .min(1, { message: 'Quantity is required' })
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Quantity must be a positive number',
    }),
  status: z.enum(['In Stock', 'Out of Stock', 'On Order'], {
    required_error: 'Status is required',
  }),
});

export type AssetFormValues = z.infer<typeof assetSchema>;
