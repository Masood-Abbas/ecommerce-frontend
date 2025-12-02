import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import productReducer from "./producttSlice/productSlice"
import cartReducer from "./cartSlice/cartSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart:cartReducer
  },
});
