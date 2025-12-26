
import { createSlice } from "@reduxjs/toolkit";

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    shopData: null,
  },
  reducers: {
    fetchShopData: (state, action) => {
      state.shopData = action.payload;
    },
  },
});

export const {  fetchShopData } = shopSlice.actions;
export default shopSlice.reducer;