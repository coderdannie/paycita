import { initialUser } from "@/src/utils/initialData";
import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isLoggedIn: boolean;
  user: LoggedInUserProps;
  token?: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, { payload }) => {
      state.isLoggedIn = true;
      state.user = payload;
    },
    logUserOut: (state) => {
      state.isLoggedIn = false;
      state.user = initialUser;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { loginUser, logUserOut, updateUser, setToken } =
  authSlice.actions;
export default authSlice.reducer;
