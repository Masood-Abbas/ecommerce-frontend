import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import productReducer from "./producttSlice/productSlice";
import cartReducer from "./cartSlice/cartSlice";
import categoriesReducer from "./categoriesSlice/categoriesSlice";
import orderReducer from "./orderSlice/orderSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { customMiddleware } from "./middleware/customMiddleware";
import shopReducer from "./shopSlice/shopSlice"

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  products: productReducer,
  cart: cartReducer,
  categories: categoriesReducer,
  orders: orderReducer,
  shop:shopReducer,
});

export const store = configureStore({
  reducer:  rootReducer,
  middleware: customMiddleware,
});

export const persistor = persistStore(store)