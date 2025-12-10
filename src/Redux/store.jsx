import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import productReducer from "./producttSlice/productSlice";
import cartReducer from "./cartSlice/cartSlice";
import categoriesReducer from "./categoriesSlice/categoriesSlice";
import orderReducer from "./orderSlice/orderSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    orders: orderReducer,
  },
});
