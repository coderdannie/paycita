import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authReducer, { AuthState } from "./features/authSlice";
import dashboardReducer, { DashboardState } from "./features/dashboardSlice";
import UserDetailsReducer, { UserDetails } from "./features/userDetailsSlice";
import EmployeeDetailsReducer, {
  EmployeeDetails,
} from "./features/employeeDetails";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  userDetails: UserDetailsReducer,
  employeeDetails: EmployeeDetailsReducer,
  // more reducers
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

const persistor = persistStore(store);

export type RootState = {
  auth: AuthState;
  dashboard: DashboardState;
  userDetails: UserDetails;
  employeeDetails: EmployeeDetails;
};

export { store, persistor };
