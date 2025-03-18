import * as z from 'zod';

export const userDetailsSchema = z.object({
  fullName: z.string().min(1, { message: 'Full Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z
    .string()
    .min(1, { message: 'Phone Number is required' })
    .regex(/^\d{10,15}$/, { message: 'Invalid phone number' }), // 10-15 digit validation

  gender: z.string().min(1, { message: 'Gender is required' }),
  maritalStatus: z.string().min(1, { message: 'Marital Status is required' }),

  address: z.object({
    country: z.string().min(1, { message: 'Country is required' }),
    residentialAddress: z
      .string()
      .min(1, { message: 'Residential Address is required' }),
  }),

  emergencyContact: z.object({
    fullName: z
      .string()
      .min(1, { message: 'Emergency Contact Name is required' }),
    relationship: z.string().min(1, { message: 'Relationship is required' }),
    phoneNumber: z
      .string()
      .min(1, { message: 'Phone Number is required' })
      .regex(/^\d{10,15}$/, { message: 'Invalid phone number' }),
  }),
});
export type userDetailsSchemaType = z.infer<typeof userDetailsSchema>;

export const employeeDetailsSchema = z.object({
  employeeNumber: z.string().min(1, { message: 'Employee Number is required' }),
  employeeName: z.string().min(1, { message: 'Employee Name is required' }),
  jobTitle: z.string().min(1, { message: 'Job Title is required' }),
  jobLevel: z.string().min(1, { message: 'Job Level is required' }),
  employmentType: z.string().min(1, { message: 'Employment Type is required' }),
  locationType: z.string().min(1, { message: 'Location Type is required' }),
  hireDate: z.string().min(1, { message: 'Hire Date is required' }), // Assuming hire date is a string (e.g., YYYY-MM-DD)
  basicSalary: z.string().min(1, { message: 'Basic Salary is required' }), // New field
  taxStatus: z.string().min(1, { message: 'Tax Status is required' }), // New field
  taxNumber: z.string().min(1, { message: 'Tax Number is required' }), // New field
  taxMethod: z.string().min(1, { message: 'Tax Method is required' }), // New field
  taxSalary: z.string().min(1, { message: 'Tax Salary is required' }), // New field
});

export type EmployeeDetailsSchemaType = z.infer<typeof employeeDetailsSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const resumptionDetailsSchema = z.object({
  clockIn: z.string().min(1, { message: 'Employee Number is required' }),
  clockOut: z.string().min(1, { message: 'Employee Name is required' }),
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
