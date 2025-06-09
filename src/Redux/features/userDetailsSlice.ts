import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define TypeScript types based on the Zod schema
export type UserAddress = {
  country: string;
  residentialAddress: string;
};

export type EmergencyContact = {
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
};

export type Guarantor = {
  fullName: string;
  address: string;
  phoneNumber: string;
  relationship: string;
};

export type UserDetails = {
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  marital_status: string;
  address: UserAddress;
  emergencyContact: EmergencyContact;
  guarantors: Guarantor[];
  date_of_birth?: string | null;
};


// Define the initial state
const initialState: UserDetails = null as UserDetails;

// Create the slice
const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<Partial<UserDetails>>) => {
      return { ...state, ...action.payload };
    },

    updateBasicInfo: (
      state,
      action: PayloadAction<{
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        gender?: string;
        maritalStatus?: string;
      }>
    ) => {
      return { ...state, ...action.payload };
    },

    updateAddress: (state, action: PayloadAction<Partial<UserAddress>>) => {
      state.address = { ...state.address, ...action.payload };
    },

    updateEmergencyContact: (
      state,
      action: PayloadAction<Partial<EmergencyContact>>
    ) => {
      state.emergencyContact = { ...state.emergencyContact, ...action.payload };
    },

    updateGuarantor: (
      state,
      action: PayloadAction<{
        index: number;
        data: Partial<Guarantor>;
      }>
    ) => {
      const { index, data } = action.payload;
      if (index >= 0 && index < state.guarantors.length) {
        state.guarantors[index] = { ...state.guarantors[index], ...data };
      }
    },

    addGuarantor: (state, action: PayloadAction<Guarantor>) => {
      if (state.guarantors.length < 2) {
        state.guarantors.push(action.payload);
      }
    },

    removeGuarantor: (state, action: PayloadAction<number>) => {
      if (state.guarantors.length > 0) {
        state.guarantors.splice(action.payload, 1);

        while (state.guarantors.length < 2) {
          state.guarantors.push({
            fullName: '',
            address: '',
            phoneNumber: '',
            relationship: '',
          });
        }
      }
    },

    resetUserDetails: () => initialState,
  },
});

// Export actions
export const {
  setUserDetails,
  updateBasicInfo,
  updateAddress,
  updateEmergencyContact,
  updateGuarantor,
  addGuarantor,
  removeGuarantor,
  resetUserDetails,
} = userDetailsSlice.actions;

// Export reducer
export default userDetailsSlice.reducer;
