import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define TypeScript type based on the Zod schema
export type EmployeeDetails = {
  employeeNumber: string;
  jobTitle: string;
  jobLevel: string;
  department: string;
  email: string;
  employmentType: string;
  locationType: string;
  hireDate: string; // Format: YYYY-MM-DD
  basicSalary: string;
  taxStatus: string;
  taxNumber: string;
  taxMethod: string;
  pensionCompany: string;
};

const initialState: EmployeeDetails = null as EmployeeDetails;

const employeeDetailsSlice = createSlice({
  name: "employeeDetails",
  initialState,
  reducers: {
    setEmployeeDetails: (
      state,
      action: PayloadAction<Partial<EmployeeDetails>>
    ) => {
      return { ...state, ...action.payload };
    },

    updateEmploymentInfo: (
      state,
      action: PayloadAction<{
        employeeNumber?: string;
        jobTitle?: string;
        jobLevel?: string;
        department?: string;
        employmentType?: string;
      }>
    ) => {
      return { ...state, ...action.payload };
    },

    updateContactInfo: (
      state,
      action: PayloadAction<{
        email?: string;
        locationType?: string;
      }>
    ) => {
      return { ...state, ...action.payload };
    },

    updateFinancialInfo: (
      state,
      action: PayloadAction<{
        basicSalary?: string;
        taxStatus?: string;
        taxNumber?: string;
        taxMethod?: string;
        pensionCompany?: string;
      }>
    ) => {
      return { ...state, ...action.payload };
    },

    updateHireDate: (state, action: PayloadAction<string>) => {
      state.hireDate = action.payload;
    },

    resetEmployeeDetails: () => initialState,
  },
});

export const {
  setEmployeeDetails,
  updateEmploymentInfo,
  updateContactInfo,
  updateFinancialInfo,
  updateHireDate,
  resetEmployeeDetails,
} = employeeDetailsSlice.actions;

export default employeeDetailsSlice.reducer;
