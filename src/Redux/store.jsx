// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice/authSlice";
// import productReducer from "./producttSlice/productSlice"
// import cartReducer from "./cartSlice/cartSlice"

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     products: productReducer,
//     cart:cartReducer
//   },
// });
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import rootReducer from "./persistConfig/persistConfig"

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);