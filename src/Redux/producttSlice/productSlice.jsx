import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    bestSellingProducts: [],
    allProducts: [],
  },
  reducers: {
    setBestSellingProducts: (state, action) => {
      state.bestSellingProducts = action.payload.products || [];
    },
    appendAllProducts: (state, action) => {
      state.allProducts = [...state.allProducts, ...(action.payload.products || [])];
    },
  },
});

export const { setBestSellingProducts, appendAllProducts } = productSlice.actions;
export default productSlice.reducer;
