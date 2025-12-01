import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../authSlice/authSlice"
import productReducer from "../producttSlice/productSlice"
import cartReducer from "../cartSlice/cartSlice"


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
});

export default persistReducer(persistConfig, rootReducer);
