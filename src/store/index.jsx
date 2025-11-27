import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/authSlice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
