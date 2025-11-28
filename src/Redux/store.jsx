import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import productReducer from "./producttSlice/productSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer
  },
});
