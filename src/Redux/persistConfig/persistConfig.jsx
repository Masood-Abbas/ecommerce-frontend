import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../authSlice/authSlice";
import productReducer from "../producttSlice/productSlice";
import cartReducer from "../cartSlice/cartSlice";

// user ONLY
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user"],
};

// accessToken ONLY
const accessTokenPersistConfig = {
  key: "accessToken",
  storage,
  whitelist: ["accessToken"],
};

// refreshToken ONLY
const refreshTokenPersistConfig = {
  key: "refreshToken",
  storage,
  whitelist: ["refreshToken"],
};

// cart
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "totalQuantity", "totalPrice"],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, authReducer),
  accessToken: persistReducer(accessTokenPersistConfig, authReducer),
  refreshToken: persistReducer(refreshTokenPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  products: productReducer,
});

export default rootReducer;
